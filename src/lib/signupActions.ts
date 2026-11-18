'use server';

import { createHmac, randomInt, randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { Resend } from 'resend';
import * as Yup from 'yup';
import { prisma } from './prisma';
import { HawaiiEmailSchema, PasswordSchema } from './validationSchemas';
import { createElement } from 'react';
import { EmailTemplate } from '@/components/email-template';

const TEN_MINUTES = 10 * 60_000;
const ONE_HOUR = 60 * 60_000;
const MAX_ATTEMPTS = 100;
const MAX_SENDS_PER_HOUR = 100;

const requestSchema = Yup.object({ email: HawaiiEmailSchema }).required();
const verifySchema = Yup.object({
  verificationId: Yup.string().strict().uuid().required(),
  code: Yup.string().strict().matches(/^\d{6}$/).required(),
  password: PasswordSchema,
}).required();

function digestCode(id: string, code: string) {
  const secret = process.env.EMAIL_CODE_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('Set a strong EMAIL_CODE_SECRET.');
  }
  return createHmac('sha256', secret).update(`${id}:${code}`).digest('hex');
}

// Retry only the database transaction. Never send email inside this callback.
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

export async function requestSignupCode(input: unknown) {
  let email: string;
  try {
    ({ email } = await requestSchema.validate(input, { stripUnknown: true }));
  } catch {
    return { ok: false as const, error: 'Enter a valid @hawaii.edu email address.' };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) {
    return { ok: false as const, error: 'Email verification is currently unavailable.' };
  }

  const resend = new Resend(apiKey);

  const id = randomUUID();
  const code = randomInt(0, 1_000_000).toString().padStart(6, '0');

  try {
    const tokenHash = digestCode(id, code);
    const reservation = await serializable(async (tx) => {
      const now = new Date();
      const user = await tx.user.findUnique({ where: { email } });
      if (user?.emailVerified) {
        return { error: 'This account is already verified. Please sign in.' };
      }

      const previous = await tx.emailVerificationToken.findUnique({ where: { email } });
      if (previous && now.getTime() - previous.sentAt.getTime() < 60_000) {
        return { error: 'Wait 60 seconds before requesting another code.' };
      }
      const sameWindow = previous !== null &&
        now.getTime() - previous.windowStartsAt.getTime() < ONE_HOUR;
      if (sameWindow && previous.sendCount >= MAX_SENDS_PER_HOUR) {
        return { error: 'Too many code requests. Try again in one hour.' };
      }

      const data = {
        id,
        email,
        tokenHash,
        expiresAt: new Date(now.getTime() + TEN_MINUTES),
        sentAt: now,
        attempts: 0,
        windowStartsAt: sameWindow ? previous.windowStartsAt : now,
        sendCount: sameWindow ? previous.sendCount + 1 : 1,
      };
      await tx.emailVerificationToken.upsert({ where: { email }, create: data, update: data });
      return { error: null };
    });

    if (reservation.error) return { ok: false as const, error: reservation.error };

    try {
    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: 'Your UHM RateMyAccess verification code',

      react: createElement(EmailTemplate, {
        verificationCode: code,
        expiresInMinutes: 10,
      }),

      text: [
        `Your verification code is: ${code}`,
        '',
        'Enter it on the signup page you already have open.',
        'This code expires in 10 minutes.',
        'Only the newest code works.',
        '',
        'Do not share this code with anyone.',
        'If you did not request this email, ignore it.',
      ].join('\n'),
    });
  if (error) {
    throw new Error(`${error.name}: ${error.message}`);
  }
  } catch (error) {
  console.error(
    'Verification email failed:',
    error instanceof Error ? error.message : 'Unknown error',
  );

  // Keep the existing code that invalidates the verification token.
  await prisma.emailVerificationToken.updateMany({
    where: { id },
    data: {
      expiresAt: new Date(),
      attempts: MAX_ATTEMPTS,
    },
  });

  return {
    ok: false as const,
    error: 'Could not send the code. Wait 60 seconds and try again!',
  };
}

    // The code is only sent by email. Never return it or log it.
    return { ok: true as const, verificationId: id, email };
  } catch (error) {
  console.error('Verification code request failed:', {
    name: error instanceof Error ? error.name : 'Unknown',
    message: error instanceof Error
      ? error.message
      : 'Unknown error',
    code: error instanceof Prisma.PrismaClientKnownRequestError
      ? error.code
      : undefined,
  });

  return {
    ok: false as const,
    error: 'Could not request a code. Please try again.',
  };
  }
}

export async function verifySignupCode(input: unknown) {
  let values: Yup.InferType<typeof verifySchema>;
  try {
    values = await verifySchema.validate(input, { stripUnknown: true });
  } catch {
    return { ok: false as const, error: 'Enter a six-digit code and a password of 6–40 characters.' };
  }

  try {
    const submittedHash = digestCode(values.verificationId, values.code);
    const passwordHash = await hash(values.password, 10);

    return await serializable(async (tx) => {
      // A write reserves an attempt so concurrent submissions cannot bypass the limit.
      const reserved = await tx.emailVerificationToken.updateMany({
        where: {
          id: values.verificationId,
          expiresAt: { gt: new Date() },
          attempts: { lt: MAX_ATTEMPTS },
        },
        data: { attempts: { increment: 1 } },
      });
      if (reserved.count !== 1) {
        return { ok: false as const, error: 'Code expired or attempt limit reached. Request a new code.' };
      }

      const pending = await tx.emailVerificationToken.findUnique({
        where: { id: values.verificationId },
      });
      if (!pending || pending.tokenHash !== submittedHash) {
        // Return, rather than throw: the failed attempt must commit.
        return { ok: false as const, error: 'Incorrect verification code.' };
      }

      const email = await HawaiiEmailSchema.validate(pending.email);
      const user = await tx.user.findUnique({ where: { email } });
      if (user) {
        // Existing unverified users must know their current password, too.
        // Never replace their password or role from the signup form.
        if (user.emailVerified || !(await compare(values.password, user.password))) {
          return { ok: false as const, error: 'Could not verify this account. Check your password or sign in.' };
        }
        await tx.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
      } else {
        await tx.user.create({
          data: { email, password: passwordHash, emailVerified: new Date() },
        });
      }

      await tx.emailVerificationToken.delete({ where: { id: pending.id } });
      return { ok: true as const, email };
    });
  } catch {
    console.error('Email verification failed.');
    return { ok: false as const, error: 'Could not finish verification. Try again or sign in if your account exists.' };
  }
}