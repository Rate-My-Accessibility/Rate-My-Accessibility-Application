/*
  Warnings:

  - You are about to drop the column `condition` on the `Stuff` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stuff" DROP COLUMN "condition";

-- DropEnum
DROP TYPE "Condition";
