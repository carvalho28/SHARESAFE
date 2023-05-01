import prisma from "../../utils/prisma";
import { FileInput, FileReceive } from "./file.schema";
import fs from "fs";

export async function receiveFile(input: FileReceive) {
  const groupId = Number(input.id);

  const groupFiles = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      files: true,
    },
  });

  return groupFiles;
}

export async function uploadFile(input: FileInput) {
  const file_data = {
    file_name: input.file_info.file_name,
    file_type: input.file_info.file_type,
    file_size: input.file_info.file_size,
    iv: Buffer.from(input.file_info.iv),
    user: {
      connect: {
        id: input.file_info.user_id,
      },
    },
    created_at: new Date(),
    algorithm: input.file_info.algorithm,
  };

  const usersGroup = input.users_group.map((user) => {
    return {
      id: user.id,
      encrypted_key: user.encrypted_key.toString(),
    };
  });

  const data = {
    ...file_data,
    users_group: usersGroup,
  };

  // save the encrypted file to the /files folder
  fs.writeFile(
    `./files/${input.file_info.file_name}`,
    input.file_info.encrypted_file,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );

  const file = await prisma.encryptedFile.create({
    data,
  });

  return file;
}
