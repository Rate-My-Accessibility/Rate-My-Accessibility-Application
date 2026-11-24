/*
  Warnings:

  - You are about to drop the `Elevator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ElevatorRating` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ElevatorRating" DROP CONSTRAINT "ElevatorRating_elevatorName_fkey";

-- DropTable
DROP TABLE "Elevator";

-- DropTable
DROP TABLE "ElevatorRating";

-- DropTable
DROP TABLE "Review";
