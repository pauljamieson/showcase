-- CreateTable
CREATE TABLE "IncomingFile" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "filename" TEXT NOT NULL,

    CONSTRAINT "IncomingFile_pkey" PRIMARY KEY ("id")
);
