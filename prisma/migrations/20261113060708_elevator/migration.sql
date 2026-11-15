/*
  Warnings:

  - You are about to drop the `Stuff` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Stuff";

-- DropEnum
DROP TYPE "Condition";

-- CreateTable
CREATE TABLE "Elevator" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "photos" TEXT[],
    "scores" DOUBLE PRECISION[],
    "coordinates" DOUBLE PRECISION[],

    CONSTRAINT "Elevator_pkey" PRIMARY KEY ("id")
);
