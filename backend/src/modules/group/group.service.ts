import prisma from "../../utils/prisma";
import { GroupAddFilesInput, GroupAddMembersInput, GroupInput } from "./group.schema";

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
export async function getGroupsForUser(userId: number) {
  const userGroups = await prisma.user.findUnique({
  where: {
    id: user_id,
  },
}).groups();

  return userGroups;
}
