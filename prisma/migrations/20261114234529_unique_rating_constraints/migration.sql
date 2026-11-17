/*
  Warnings:

  - A unique constraint covering the columns `[elevatorName,user]` on the table `ElevatorRating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ElevatorRating_elevatorName_user_key" ON "ElevatorRating"("elevatorName", "user");
