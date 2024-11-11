/*
  Warnings:

  - You are about to drop the `CovertVideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PersonToVideoFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TagToVideoFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CovertVideo" DROP CONSTRAINT "CovertVideo_videoFileId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistItem" DROP CONSTRAINT "PlaylistItem_playlistId_fkey";

-- DropForeignKey
ALTER TABLE "PlaylistItem" DROP CONSTRAINT "PlaylistItem_videoId_fkey";

-- DropForeignKey
ALTER TABLE "VideoRatings" DROP CONSTRAINT "VideoRatings_videoId_fkey";

-- DropForeignKey
ALTER TABLE "_PersonToVideoFile" DROP CONSTRAINT "_PersonToVideoFile_A_fkey";

-- DropForeignKey
ALTER TABLE "_PersonToVideoFile" DROP CONSTRAINT "_PersonToVideoFile_B_fkey";

-- DropForeignKey
ALTER TABLE "_TagToVideoFile" DROP CONSTRAINT "_TagToVideoFile_A_fkey";

-- DropForeignKey
ALTER TABLE "_TagToVideoFile" DROP CONSTRAINT "_TagToVideoFile_B_fkey";

-- DropTable
DROP TABLE "CovertVideo";

-- DropTable
DROP TABLE "_PersonToVideoFile";

-- DropTable
DROP TABLE "_TagToVideoFile";

-- CreateTable
CREATE TABLE "ConvertVideo" (
    "id" SERIAL NOT NULL,
    "videoFileId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConvertVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoTag" (
    "id" SERIAL NOT NULL,
    "videoId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoPerson" (
    "id" SERIAL NOT NULL,
    "videoId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoPerson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConvertVideo_videoFileId_key" ON "ConvertVideo"("videoFileId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoTag_videoId_tagId_key" ON "VideoTag"("videoId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "VideoPerson_videoId_personId_key" ON "VideoPerson"("videoId", "personId");

-- AddForeignKey
ALTER TABLE "ConvertVideo" ADD CONSTRAINT "ConvertVideo_videoFileId_fkey" FOREIGN KEY ("videoFileId") REFERENCES "VideoFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoRatings" ADD CONSTRAINT "VideoRatings_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "VideoFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "VideoFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoTag" ADD CONSTRAINT "VideoTag_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "VideoFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoTag" ADD CONSTRAINT "VideoTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoPerson" ADD CONSTRAINT "VideoPerson_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "VideoFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoPerson" ADD CONSTRAINT "VideoPerson_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
