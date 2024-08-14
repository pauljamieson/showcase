-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_creator_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_creator_fkey";

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_creator_fkey" FOREIGN KEY ("creator") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_creator_fkey" FOREIGN KEY ("creator") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
