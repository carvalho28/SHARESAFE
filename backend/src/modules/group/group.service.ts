import prisma from "../../utils/prisma";
import {
  GetUserFromGroupInput,
  GroupAddFilesInput,
  GroupAddMembersInput,
  GroupInput,
} from "./group.schema";

export async function createGroup(input: GroupInput) {
  const data = {
    name: input.name,
    created_at: new Date(),
    files: {
      connect: input.files.map((fileId) => ({ id: fileId })),
    },
    members: {
      connect: input.members.map((memberId) => ({ id: memberId })),
    },
  };

  const group = await prisma.group.create({
    data,
  });

  return group;
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
