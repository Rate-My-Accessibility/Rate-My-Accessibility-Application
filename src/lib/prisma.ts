import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString =
  process.env.DATABASE_URL_POOLED ??
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Database connection string is missing.');
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };