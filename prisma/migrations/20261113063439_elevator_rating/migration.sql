-- CreateTable
CREATE TABLE "ElevatorRating" (
    "id" SERIAL NOT NULL,
    "elevatorId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "scores" DOUBLE PRECISION[],

    CONSTRAINT "ElevatorRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ElevatorRating" ADD CONSTRAINT "ElevatorRating_elevatorId_fkey" FOREIGN KEY ("elevatorId") REFERENCES "Elevator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElevatorRating" ADD CONSTRAINT "ElevatorRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
