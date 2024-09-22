/*
  Warnings:

  - You are about to drop the `UserRatings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserRatings" DROP CONSTRAINT "UserRatings_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserRatings" DROP CONSTRAINT "UserRatings_videoId_fkey";

-- DropTable
DROP TABLE "UserRatings";

-- CreateTable
CREATE TABLE "VideoRatings" (
    "videoId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoRatings_pkey" PRIMARY KEY ("videoId","userId")
);

-- AddForeignKey
ALTER TABLE "VideoRatings" ADD CONSTRAINT "VideoRatings_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "VideoFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoRatings" ADD CONSTRAINT "VideoRatings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
