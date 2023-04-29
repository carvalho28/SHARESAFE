/*
  Warnings:

  - You are about to drop the column `groupId` on the `EncryptedFile` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EncryptedFile" DROP CONSTRAINT "EncryptedFile_groupId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_groupId_fkey";

-- AlterTable
ALTER TABLE "EncryptedFile" DROP COLUMN "groupId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "groupId";

-- CreateTable
CREATE TABLE "_GroupFile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_GroupMember" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GroupFile_AB_unique" ON "_GroupFile"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupFile_B_index" ON "_GroupFile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupMember_AB_unique" ON "_GroupMember"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupMember_B_index" ON "_GroupMember"("B");

-- AddForeignKey
ALTER TABLE "_GroupFile" ADD CONSTRAINT "_GroupFile_A_fkey" FOREIGN KEY ("A") REFERENCES "EncryptedFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupFile" ADD CONSTRAINT "_GroupFile_B_fkey" FOREIGN KEY ("B") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupMember" ADD CONSTRAINT "_GroupMember_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupMember" ADD CONSTRAINT "_GroupMember_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
