-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_reviewId_fkey";

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
