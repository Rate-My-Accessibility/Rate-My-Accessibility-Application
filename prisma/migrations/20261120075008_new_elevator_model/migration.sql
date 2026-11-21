-- CreateTable
CREATE TABLE "Elevator" (
    "id" SERIAL NOT NULL,
    "latitude" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Elevator_pkey" PRIMARY KEY ("id")
);
