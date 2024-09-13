/*
  Warnings:

  - A unique constraint covering the columns `[convertId]` on the table `VideoFile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `filepath` to the `VideoFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VideoFile" ADD COLUMN     "convertId" INTEGER,
ADD COLUMN     "filepath" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CovertVideo" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "videoFileId" INTEGER NOT NULL,

    CONSTRAINT "CovertVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CovertVideo_videoFileId_key" ON "CovertVideo"("videoFileId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoFile_convertId_key" ON "VideoFile"("convertId");

-- AddForeignKey
ALTER TABLE "CovertVideo" ADD CONSTRAINT "CovertVideo_videoFileId_fkey" FOREIGN KEY ("videoFileId") REFERENCES "VideoFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
