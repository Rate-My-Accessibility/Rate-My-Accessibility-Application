-- CreateTable
CREATE TABLE "Photo" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "string" TEXT NOT NULL,
    "owner" TEXT NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
