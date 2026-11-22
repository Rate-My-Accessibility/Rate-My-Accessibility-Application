'use server';

import { compare, hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { auth } from './auth';
import { prisma } from './prisma';
import { HawaiiEmailSchema, PasswordSchema } from './validationSchemas';

export async function addReview(review : { name: string; content: string; owner: string;}) { 
  await prisma.oldReview.create({ // was: "review.create"
    data: {
      name: review.name,
      content: review.content,
      owner: review.owner,
    },
  });
}



/** Authenticated password change, not a forgot-password/reset endpoint. */
export async function changePassword(credentials: {
  email: string;
  password: string;
  currentPassword?: string;
}) {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Please sign in first.');

  const email = await HawaiiEmailSchema.validate(credentials.email);
  if (email !== session.user.email.trim().toLowerCase()) {
    throw new Error('You can only change your own password.');
  }
  if (
    typeof credentials.currentPassword !== 'string' ||
    !credentials.currentPassword ||
    credentials.currentPassword.length > 1024
  ) throw new Error('Enter your current password.');

  const newPassword = await PasswordSchema.validate(credentials.password);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.emailVerified || !(await compare(credentials.currentPassword, user.password))) {
    throw new Error('Could not change password. Check your current password.');
  }

  const changed = await prisma.user.updateMany({
    where: { id: user.id, password: user.password },
    data: { password: await hash(newPassword, 10) },
  });
  if (changed.count !== 1) throw new Error('Your password changed during this request. Please try again.');
}
