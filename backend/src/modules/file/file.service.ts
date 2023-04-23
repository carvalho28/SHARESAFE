import prisma from "../../utils/prisma";
import { FileInput } from "./file.schema";

export async function uploadFile(input: FileInput) {
  const data = {
    file_name: input.file_name,
    file_type: input.file_type,
    file_size: input.file_size,
    encrypted_file: input.encrypted_file,
    iv: input.iv,
    user: {
      connect: {
        id: input.user_id,
      },
    },
  };

  const file = await prisma.encryptedFile.create({
    data,
  });

  return file;
}
