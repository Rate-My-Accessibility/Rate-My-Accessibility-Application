'use server';

//import { Condition } from '@prisma/client';
//import { Stuff } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { auth } from './auth';
import { prisma } from './prisma';
import { HawaiiEmailSchema, PasswordSchema } from './validationSchemas';
 /**
   *
 * Adds a new stuff to the database.
 * @param stuff, an object with the following properties: name, quantity, owner, condition.
 *export async function addStuff(stuff: { name: string; quantity: number; owner: string; condition: string }) {
 
  // console.log(`addStuff data: ${JSON.stringify(stuff, null, 2)}`);
  let condition: Condition = 'good';
  if (stuff.condition === 'poor') {
    condition = 'poor';
  } else if (stuff.condition === 'excellent') {
    condition = 'excellent';
  } else {
    condition = 'fair';
  }
  await prisma.stuff.create({
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition,
    },
  });
  // After adding, redirect to the list page
  redirect('/list');
}
  
/**
 * Edits an existing stuff in the database.
 * @param stuff, an object with the following properties: id, name, quantity, owner, condition.
 *
export async function editStuff(stuff: Stuff) {
  // console.log(`editStuff data: ${JSON.stringify(stuff, null, 2)}`);
  await prisma.stuff.update({
    where: { id: stuff.id },
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition: stuff.condition,
    },
  });
  // After updating, redirect to the list page
  redirect('/list');
}

/**
 * Deletes an existing stuff from the database.
 * @param id, the id of the stuff to delete.
 *
export async function deleteStuff(id: number) {
  // console.log(`deleteStuff id: ${id}`);
  await prisma.stuff.delete({
    where: { id },
  });
  // After deleting, redirect to the list page
  redirect('/list');
}

// createUser was removed. Account creation must go through verifySignupCode.
*/



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
