/*
  Warnings:

  - Added the required column `algorithm` to the `EncryptedFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EncryptedFile" ADD COLUMN     "algorithm" TEXT NOT NULL;
