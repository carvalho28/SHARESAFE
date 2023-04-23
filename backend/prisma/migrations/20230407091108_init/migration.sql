-- CreateTable
CREATE TABLE "EncryptedFile" (
    "id" SERIAL NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "encrypted_file" BYTEA NOT NULL,
    "iv" BYTEA NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "EncryptedFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EncryptedFile" ADD CONSTRAINT "EncryptedFile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
