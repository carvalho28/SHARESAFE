/*
  Warnings:

  - The `users_group` column on the `EncryptedFile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "EncryptedFile" DROP COLUMN "users_group",
ADD COLUMN     "users_group" BYTEA[];
