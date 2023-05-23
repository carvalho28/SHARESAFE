-- AlterTable
ALTER TABLE "EncryptedFile" ADD COLUMN     "mac_algorithm" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "signature_algorithm" TEXT NOT NULL DEFAULT '';
