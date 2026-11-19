import { prisma } from './lib/prisma';
import { Role } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);
  for (const account of config.defaultAccounts) {
    const role = account.role as Role || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    const emailVerified = account.emailVerified
        ? new Date(account.emailVerified)
        : null;
    if (emailVerified && Number.isNaN(emailVerified.getTime())) {
      throw new Error(`Invalid verification date for ${account.email}`);
    }
    await prisma.user.upsert({
      where: { email: account.email },
      update: {
        password,
        emailVerified,
      },
      create: {
        email: account.email,
        password,
        role,
        emailVerified,
      },
    });
  }
  for (const elevator of config.defaultElevators) {
    console.log(`  Adding elevator: ${elevator.name}`);
    await prisma.elevator.upsert({
      where: { id: config.defaultElevators.indexOf(elevator) + 1 },
      update: {},
      create: {
        name: elevator.name,
        photos: elevator.photos,
        scores: elevator.scores,
        coordinates: elevator.coordinates,
      },
    });
  }
  for (const rating of config.defaultElevatorRatings) {
    console.log(`  Adding rating for elevator "${rating.elevatorName}" by "${rating.user}".`);
    await prisma.elevatorRating.upsert({
      where: { 
        elevatorName_user: { elevatorName: rating.elevatorName, user: rating.user }
       },
      update: {},
      create: {
        elevatorName: rating.elevatorName,
        user: rating.user,
        scores: rating.scores,
        text: rating.text,
      },
    });
  }
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
