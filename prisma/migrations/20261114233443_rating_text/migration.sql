/*
  Warnings:

  - You are about to drop the column `elevatorId` on the `ElevatorRating` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ElevatorRating` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Elevator` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `elevatorName` to the `ElevatorRating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `ElevatorRating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user` to the `ElevatorRating` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ElevatorRating" DROP CONSTRAINT "ElevatorRating_elevatorId_fkey";

-- DropForeignKey
ALTER TABLE "ElevatorRating" DROP CONSTRAINT "ElevatorRating_userId_fkey";

-- AlterTable
ALTER TABLE "ElevatorRating" DROP COLUMN "elevatorId",
DROP COLUMN "userId",
ADD COLUMN     "elevatorName" TEXT NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL,
ADD COLUMN     "user" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Elevator_name_key" ON "Elevator"("name");

-- AddForeignKey
ALTER TABLE "ElevatorRating" ADD CONSTRAINT "ElevatorRating_elevatorName_fkey" FOREIGN KEY ("elevatorName") REFERENCES "Elevator"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
