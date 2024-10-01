/*
  Warnings:

  - A unique constraint covering the columns `[position]` on the table `PlaylistItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PlaylistItem_position_key" ON "PlaylistItem"("position");
