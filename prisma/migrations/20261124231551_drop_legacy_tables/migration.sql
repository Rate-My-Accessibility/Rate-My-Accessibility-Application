/*
  Warnings:

  - You are about to drop the `Photo` table. All legacy review photos (pre-Supabase pipeline) are lost.
  - You are about to drop the `Elevator` table. All the data it contains will be lost.
  - You are about to drop the `Review` table (legacy). All the data it contains will be lost.

  The `ElevatorRating` table was already dropped by 20261120075008_new_elevator_model.
*/
-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_reviewId_fkey";

-- DropTable
DROP TABLE "Photo";

-- DropTable
DROP TABLE "Elevator";

-- DropTable
DROP TABLE "Review";
