/*
  Warnings:

  - Added the required column `position` to the `PlaylistItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlaylistItem" ADD COLUMN     "position" INTEGER NOT NULL;
