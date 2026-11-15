-- CreateEnum
CREATE TYPE "Feature" AS ENUM ('elevator', 'stair', 'ramp', 'other');

-- AlterTable
ALTER TABLE "Stuff" ADD COLUMN     "feature" "Feature" NOT NULL DEFAULT 'other';
