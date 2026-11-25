import { prisma } from './lib/prisma';
import { Role, FeatureType } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';
import updateFeatureScore from "@/lib/updateScore";

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
  for (const aspect of config.defaultFeatureAspects) {
  const type = aspect.type as FeatureType;
  console.log(`  Adding aspect for ${aspect.type} feature: ${aspect.aspectKey} [Weight: ${aspect.weight}%]`);
  await prisma.featureAspect.upsert({
    where: {
      type_aspectKey: { type, aspectKey: aspect.aspectKey }
     },
    update: {},
    create: {
      type,
      aspectKey: aspect.aspectKey,
      label: aspect.label,
      weight: aspect.weight,
    },
  });
}
for (const feature of config.defaultFeatures) {
    console.log(`  Adding feature: ${feature.name}`)
    await prisma.feature.upsert({
      where: { sourceObjectId: feature.sourceObjectId },
      update: {},
      create: {
        type: FeatureType.ELEVATOR,
        name: feature.name,
        building: feature.building,
        longitude: feature.longitude,
        latitude: feature.latitude,
        sourceObjectId: feature.sourceObjectId,
      },
    });
  }
  for (const image of config.defaultFeatureImages) {
    const feature = await prisma.feature.findUniqueOrThrow({ where: { sourceObjectId: image.sourceObjectId } });
    await prisma.image.upsert({
      where: { featureId_priority: { featureId: feature.id, priority: image.priority } },
      update: {},
      create: {
        featureId: feature.id,
        file: image.file,
        altText: image.altText,
        priority: image.priority,
      },
    });
  }
  for (const review of config.defaultFeatureReviews) {
    const feature = await prisma.feature.findUniqueOrThrow({ where: { sourceObjectId: review.sourceObjectId } });
    const user = await prisma.user.findUniqueOrThrow({ where: { email: review.user } });
    await prisma.review.upsert({
      where: { featureId_userId: { featureId: feature.id, userId: user.id } },
      update: {},
      create: {
        featureId: feature.id,
        userId: user.id,
        scores: review.scores,
        text: review.text,
      },
    });
  }
  for (const { id, name } of await prisma.feature.findMany({ select: { id: true, name: true } })) {
    console.log(`  Updating score for ${name}`);
    await updateFeatureScore(id);
  }
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
