/*
  Warnings:

  - A unique constraint covering the columns `[videoId,playlistId]` on the table `PlaylistItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[playlistId,position]` on the table `PlaylistItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PlaylistItem_position_key";

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistItem_videoId_playlistId_key" ON "PlaylistItem"("videoId", "playlistId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistItem_playlistId_position_key" ON "PlaylistItem"("playlistId", "position");
