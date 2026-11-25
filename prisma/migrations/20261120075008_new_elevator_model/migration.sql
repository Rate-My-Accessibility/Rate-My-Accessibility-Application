-- DropTable
-- Legacy Elevator v1 (name/photos/scores/coordinates) and its dependent ratings
-- table must be removed before the OneMap-derived model replaces it.
DROP TABLE "ElevatorRating";
DROP TABLE "Elevator";

-- CreateTable
CREATE TABLE "Elevator" (
    "id" SERIAL NOT NULL,
    "latitude" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Elevator_pkey" PRIMARY KEY ("id")
);
