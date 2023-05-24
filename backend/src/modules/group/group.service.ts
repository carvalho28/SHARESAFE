import { diffieH2 } from "../../utils/diffie";
import prisma from "../../utils/prisma";
import {
  GetUserFromGroupInput,
  GroupAddFilesInput,
  GroupAddMembersInput,
  GroupInput,
} from "./group.schema";
import crypto from "crypto";

// export async function createGroup(input: GroupInput) {
//   const data = {
//     name: input.name,
//     created_at: new Date(),
//     // files: {
//     //   connect: input.files.map((fileId) => ({ id: fileId })),
//     // },
//     // members: {
//     //   connect: input.members.map((memberId) => ({ id: memberId })),
//     // },
//   };

//   const group = await prisma.group.create({
//     data,
//   });

//   const nMembers = 2;
//   const x = diffieH(nMembers);
//   console.log(x);

//   return group;
// }
export async function createGroup(input: GroupInput) {
  const userIds = await prisma.user.findMany({
    where: {
      email: {
        in: input.members,
      },
    },
  });

  const data = {
    name: input.name,
    created_at: new Date(),
    // files: {
    //   connect: input.files.map((fileId) => ({ id: fileId })),
    // },
    members: {
      connect: userIds.map((user) => ({ id: user.id })),
    },
  };

  const group = await prisma.group.create({
    data,
  });

  const nMembers = 2;
  processDiffieH(nMembers, group.id);

  return group;
}

async function processDiffieH(
  nMembers: number,
  groupId: number
): Promise<void> {
  return new Promise(async (resolve) => {
    setTimeout(async () => {
      // get group members public keys
      const groupMembers = await prisma.group.findUnique({
        where: {
          id: groupId,
        },
        include: {
          members: true,
        },
      });

      const x = diffieH2(nMembers);
      console.log("result of diffieH: " + x);

      // // encrypt x with each member's public key
      const encryptedData = groupMembers?.members.map((member) => {
        const encryptedX = encryptWithPublicKey(x, member.public_key);
        return {
          user_id: member.id,
          encrypted_x: encryptedX,
        };
      });

      console.log(encryptedData);

      // store encrypted chunks in the database
      await prisma.group.update({
        where: {
          id: groupId,
        },
        data: {
          group_key: {
            encryptedData,
          },
        },
      });

      console.log("Group key for group " + groupId + " stored in the database");
      resolve();
    }, 2000); // Delay of 1 second (adjust as needed)
  });
}

// Function to encrypt x with public key
function encryptWithPublicKey(x: any, publicKey: string): string {
  const buffer = Buffer.from(x); // Convert x to a buffer
  const encryptedBuffer = crypto.publicEncrypt(publicKey, buffer); // Encrypt the buffer using the public key
  const encryptedX = encryptedBuffer.toString("base64"); // Convert the encrypted buffer to a base64 string
  return encryptedX;
}

// add files to group
export async function addFilesToGroup(input: GroupAddFilesInput) {
  const data = {
    files: {
      connect: input.files.map((fileId) => ({ id: fileId })),
    },
  };

  const group = await prisma.group.update({
    where: {
      id: input.id,
    },
    data,
  });

  return group;
}

// add members to group
export async function addMembersToGroup(input: GroupAddMembersInput) {
  const data = {
    members: {
      connect: input.members.map((memberId) => ({ id: memberId })),
    },
  };

  const group = await prisma.group.update({
    where: {
      id: input.id,
    },
    data,
  });

  return group;
}

// get groups for a given user
export async function getGroupsForUser(user_id: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(user_id.toString()),
    },
    include: {
      groups: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.groups;
}

export async function getUsersFromGroup(input: GetUserFromGroupInput) {
  return prisma.group.findUnique({
    where: {
      id: parseInt(input.group_id.toString()),
    },
    include: {
      members: true,
    },
  });
}
