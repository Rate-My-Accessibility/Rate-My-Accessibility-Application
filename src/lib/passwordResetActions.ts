'use server';

import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { createElement } from 'react';
import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { Resend } from 'resend';
import { prisma } from './prisma';
import { PasswordResetEmail } from '@/components/password-reset-email';

const RESET_LIFETIME_MS = 30 * 60_000;
const ONE_HOUR_MS = 60 * 60_000;
const RESPONSE_FLOOR_MS = 1500;
const GENERIC_MESSAGE = 'If an account exists for that email, a password reset link will be sent. Check your inbox and spam folder.';
const INVALID_LINK = 'This reset link is invalid or expired. Please request a new one.';

function digest(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  return email.length <= 254 && /^[^\s@]+@hawaii\.edu$/.test(email) ? email : null;
}

function getAppOrigin() {
  if (!process.env.APP_URL) throw new Error('APP_URL is missing.');
  const url = new URL(process.env.APP_URL);
  const localHttp = process.env.NODE_ENV !== 'production' &&
    url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (
    (url.protocol !== 'https:' && !localHttp) || url.username || url.password ||
    url.search || url.hash || url.pathname !== '/'
  ) throw new Error('APP_URL must be your trusted HTTPS origin (or localhost during development).');
  return url.origin;
}

function logFailure(label: string, error: unknown) {
  const err = error as { name?: string; code?: string } | null;
  // No token, reset URL, password, email address, or environment secret is logged.
  console.error(label, { name: err?.name, code: err?.code });
}

async function serializable<T>(work: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.$transaction(work, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error) {
      const retryable = error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === 'P2034' || error.code === 'P2002');
      if (!retryable || attempt === 2) throw error;
    }
  }
  throw new Error('Transaction retry limit reached.');
}

export async function requestPasswordReset(input: unknown) {
  const started = Date.now();
  try {
    const email = normalizeEmail(
      input && typeof input === 'object' ? (input as { email?: unknown }).email : undefined,
    );
    if (!email) return { ok: true as const, message: GENERIC_MESSAGE };

    const from = process.env.RESEND_FROM;
    const apiKey = process.env.RESEND_API_KEY;
    const origin = getAppOrigin();
    if (!from || !apiKey) throw new Error('Resend is not configured.');

    const token = randomBytes(32).toString('hex');
    const tokenHash = digest(token);
    const id = randomUUID();

    const reservation = await serializable(async (tx) => {
      const user = await tx.user.findUnique({ where: { email } });
      if (!user) return null;

      const now = new Date();
      const previous = await tx.passwordResetToken.findUnique({ where: { userId: user.id } });
      if (previous && now.getTime() - previous.requestedAt.getTime() < 60_000) return null;
      const sameWindow = previous !== null &&
        now.getTime() - previous.windowStartsAt.getTime() < ONE_HOUR_MS;
      if (sameWindow && previous.sendCount >= 5) return null;

      const data = {
        id,
        userId: user.id,
        email: user.email,
        tokenHash,
        passwordFingerprint: digest(user.password),
        expiresAt: new Date(now.getTime() + RESET_LIFETIME_MS),
        requestedAt: now,
        windowStartsAt: sameWindow ? previous.windowStartsAt : now,
        sendCount: sameWindow ? previous.sendCount + 1 : 1,
      };
      await tx.passwordResetToken.upsert({ where: { userId: user.id }, create: data, update: data });
      return { id, email: user.email };
    });

    if (reservation) {
      const resetUrl = new URL('/auth/reset-password', origin);
      // Fragments are not included in normal HTTP request URLs or Referer headers.
      // Only the reset form's explicit submission sends this token to the server.
      resetUrl.hash = new URLSearchParams({ token }).toString();
      try {
        const resend = new Resend(apiKey);
        const { error } = await resend.emails.send({
          from,
          to: reservation.email,
          subject: 'Reset your UHM RateMyAccess password',
          react: createElement(PasswordResetEmail, { resetUrl: resetUrl.toString() }),
          text: [
            'A password reset was requested for your UHM RateMyAccess account.',
            '',
            `Set a new password: ${resetUrl.toString()}`,
            '',
            'This link expires in 30 minutes and can be used once.',
            'If you did not request this, ignore this email. Your password has not changed.',
          ].join('\n'),
        });
        if (error) throw error;
      } catch (error) {
        // Retain send counters even when sending fails. Do not affect a newer link.
        await prisma.passwordResetToken.updateMany({
          where: { id: reservation.id, tokenHash },
          data: { tokenHash: null, expiresAt: null },
        });
        logFailure('Password reset email failed.', error);
      }
    }
  } catch (error) {
    logFailure('Password reset request failed.', error);
  } finally {
    // Reduces simple response-time differences. Slow provider calls can still vary.
    await delay(Math.max(0, RESPONSE_FLOOR_MS - (Date.now() - started)));
  }
  // Same public result for existing, absent, rate-limited accounts and send failures.
  return { ok: true as const, message: GENERIC_MESSAGE };
}

export async function resetPassword(input: unknown) {
  const values = input && typeof input === 'object'
    ? input as { token?: unknown; password?: unknown; confirmPassword?: unknown }
    : {};
  if (typeof values.token !== 'string' || !/^[a-f0-9]{64}$/.test(values.token)) {
    return { ok: false as const, error: INVALID_LINK };
  }
  if (
    typeof values.password !== 'string' ||
    values.password.length < 6 || values.password.length > 40 ||
    Buffer.byteLength(values.password, 'utf8') > 72
  ) return { ok: false as const, error: 'Use a password of 6–40 characters (up to 72 UTF-8 bytes).' };
  if (values.password !== values.confirmPassword) {
    return { ok: false as const, error: 'The passwords do not match.' };
  }

  try {
    const tokenHash = digest(values.token);
    // A cheap lookup prevents bcrypt work for missing/expired tokens.
    const exists = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!exists?.expiresAt || exists.expiresAt.getTime() <= Date.now()) {
      return { ok: false as const, error: INVALID_LINK };
    }
    const passwordHash = await hash(values.password, 10);

    const outcome = await serializable(async (tx) => {
      const pending = await tx.passwordResetToken.findUnique({ where: { tokenHash } });
      if (!pending?.expiresAt || pending.expiresAt.getTime() <= Date.now()) return null;
      const user = await tx.user.findUnique({ where: { id: pending.userId } });
      if (!user || user.email !== pending.email || digest(user.password) !== pending.passwordFingerprint) return null;

      // Claim the token atomically. GET/opening the email never runs this action.
      const consumed = await tx.passwordResetToken.updateMany({
        where: { id: pending.id, tokenHash, expiresAt: { gt: new Date() } },
        data: { tokenHash: null, expiresAt: null },
      });
      if (consumed.count !== 1) return null;

      const changed = await tx.user.updateMany({
        where: { id: user.id, password: user.password, email: user.email },
        data: { password: passwordHash, passwordVersion: { increment: 1 } },
      });
      if (changed.count !== 1) throw new Error('Account changed during password reset.');
      await tx.emailVerificationToken.deleteMany({ where: { email: user.email } });
      return { email: user.email, emailVerified: Boolean(user.emailVerified) };
    });

    if (!outcome) return { ok: false as const, error: INVALID_LINK };

    // A notification failure must not turn an already-completed reset into an error.
    try {
      const apiKey = process.env.RESEND_API_KEY;
      const from = process.env.RESEND_FROM;
      if (!apiKey || !from) throw new Error('Resend is not configured.');
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from,
        to: outcome.email,
        subject: 'Your UHM RateMyAccess password was changed',
        text: [
          'Your UHM RateMyAccess password was successfully reset.',
          'Existing login sessions will no longer authenticate.',
          'If you did not make this change, request another password reset and contact the site administrator.',
        ].join('\n'),
      });
      if (error) throw error;
    } catch (error) {
      logFailure('Password reset confirmation email failed.', error);
    }

    return { ok: true as const, emailVerified: outcome.emailVerified };
  } catch (error) {
    logFailure('Password reset failed.', error);
    return { ok: false as const, error: 'Could not reset the password. Please try again or request a new link.' };
  }
}
