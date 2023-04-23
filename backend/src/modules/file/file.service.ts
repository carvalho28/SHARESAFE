import prisma from "../../utils/prisma";
import { FileInput } from "./file.schema";
import fs from 'fs'

export async function uploadFile(input: FileInput) {
  const data = {
    file_name: input.file_name,
    file_type: input.file_type,
    file_size: input.file_size,
    iv: Buffer.from(input.iv),
    user: {
      connect: {
        id: input.user_id,
      },
    },
    created_at: new Date(),
  };
  // encrypted_file: Buffer.from(input.encrypted_file),

  // save the encrypted file to the /files folder
  fs.writeFile(`./files/${input.file_name}`, input.encrypted_file, (err) => {
    if (err) {
      console.log(err);
    }
  });


  const file = await prisma.encryptedFile.create({
    data,
  });

  return file;
}
