-- CreateTable
CREATE TABLE "VideoFile" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "filename" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "videoCodec" TEXT NOT NULL,
    "audioCodec" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "rating" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "VideoFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TagToVideoFile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PersonToVideoFile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TagToVideoFile_AB_unique" ON "_TagToVideoFile"("A", "B");

-- CreateIndex
CREATE INDEX "_TagToVideoFile_B_index" ON "_TagToVideoFile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PersonToVideoFile_AB_unique" ON "_PersonToVideoFile"("A", "B");

-- CreateIndex
CREATE INDEX "_PersonToVideoFile_B_index" ON "_PersonToVideoFile"("B");

-- AddForeignKey
ALTER TABLE "_TagToVideoFile" ADD CONSTRAINT "_TagToVideoFile_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToVideoFile" ADD CONSTRAINT "_TagToVideoFile_B_fkey" FOREIGN KEY ("B") REFERENCES "VideoFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonToVideoFile" ADD CONSTRAINT "_PersonToVideoFile_A_fkey" FOREIGN KEY ("A") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PersonToVideoFile" ADD CONSTRAINT "_PersonToVideoFile_B_fkey" FOREIGN KEY ("B") REFERENCES "VideoFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
