-- CreateEnum
CREATE TYPE "FeatureType" AS ENUM ('ELEVATOR', 'RAMP', 'WHEELCHAIR_LIFT', 'PARKING');

-- CreateTable
CREATE TABLE "Feature" (
    "id" SERIAL NOT NULL,
    "type" "FeatureType" NOT NULL,
    "name" TEXT NOT NULL,
    "building" TEXT NOT NULL,
    "status" TEXT,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "scoreAverages" JSONB,
    "accessScore" DOUBLE PRECISION,
    "sourceObjectId" TEXT,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "featureId" INTEGER NOT NULL,
    "file" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_review" (
    "id" SERIAL NOT NULL,
    "featureId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "scores" JSONB NOT NULL,
    "text" TEXT,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureAspect" (
    "id" SERIAL NOT NULL,
    "type" "FeatureType" NOT NULL,
    "aspectKey" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "FeatureAspect_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Feature_name_key" ON "Feature"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_sourceObjectId_key" ON "Feature"("sourceObjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_featureId_priority_key" ON "Image"("featureId", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "user_review_featureId_userId_key" ON "user_review"("featureId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureAspect_type_aspectKey_key" ON "FeatureAspect"("type", "aspectKey");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_review" ADD CONSTRAINT "user_review_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_review" ADD CONSTRAINT "user_review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
