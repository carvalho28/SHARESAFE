import prisma from "../../utils/prisma";
import { FileDelete, FileInput, FileReceive } from "./file.schema";
import fs from "fs";

export async function receiveFile(input: FileReceive) {
  const groupId = Number(input.id);

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      files: {
        include: {
          user: true,
        },
      },
    },
  });

  const filePromises = (group?.files || []).map((file) => {
    return new Promise((resolve, reject) => {
      fs.readFile(
        `./files/${file.file_name}`,
        { encoding: "utf8" },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        }
      );
    });
  });

  const files = await Promise.all(filePromises);

  const result = {
    group,
    files,
  };

  return result;
}

export async function uploadFile(input: FileInput) {
  const file_data = {
    file_name: input.file_info.file_name,
    file_type: input.file_info.file_type,
    file_size: input.file_info.file_size,
    iv: input.file_info.iv,
    // User that uploaded the file
    user: {
      connect: {
        id: input.file_info.user_id,
      },
    },
    created_at: new Date(),
    algorithm: input.file_info.algorithm,
    signature: input.file_info.signature,
    signature_algorithm: input.file_info.signature_algorithm,
    mac: input.file_info.mac,
    mac_algorithm: input.file_info.mac_algorithm,
    groups: {
      connect: {
        id: input.file_info.group_id,
      },
    },
  };

  // the file encrypted_key for every user in the group
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

  fs.writeFileSync(
    `./files/${input.file_info.file_name}`,
    input.file_info.encrypted_file,
    {
      encoding: "utf8",
    }
  );

  const file = await prisma.encryptedFile.create({
    data,
  });

  return file;
}

// delete file
export async function deleteFile(input: FileDelete) {
  const id = Number(input.id);
  const file = await prisma.encryptedFile.delete({
    where: { id },
  });

  if (!file) {
    return {
      message: "File not found",
    };
  }

  return {
    message: "File deleted successfully",
  };
}
