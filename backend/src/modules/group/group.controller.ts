import { FastifyReply, FastifyRequest } from "fastify";
import {
  GroupAddFilesInput,
  GroupAddMembersInput,
  GroupInput,
  GetGroupKeysInput,
  GroupAddMemberInput,
} from "./group.schema";
import {
  addFilesToGroup,
  addMembersToGroup,
  createGroup,
  getGroupsForUser,
  getUsersFromGroup,
  getGroupKeys,
  removeUserFromGroup,
  addMemberToGroup
} from "./group.service";

// get users from a given group
export async function getUsersFromGroupHandler(
  request: FastifyRequest<{ Body: { group_id: number } }>,
  reply: FastifyReply
) {
  try {
    const users = await getUsersFromGroup(request.body);
    return reply.code(200).send(users);
  } catch (error) {
    return reply.code(400).send(error);
  }
}

export async function removeUserFromGroupHandler(
  request: FastifyRequest<{ Body: { group_id: number, user_id: number } }>,
  reply: FastifyReply
) {
  try {
    const result = await removeUserFromGroup(request.body);
    return reply.code(200).send(result);
  } catch (error) {
    return reply.code(400).send(error);
  }
}

export async function createGroupHandler(
  request: FastifyRequest<{ Body: GroupInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const group = await createGroup(body);
    return reply.code(201).send(group);
  } catch (error) {
    return reply.code(400).send(error);
  }
}

// add files to group
export async function addFilesToGroupHandler(
  request: FastifyRequest<{ Body: GroupAddFilesInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const group = await addFilesToGroup(body);
    return reply.code(201).send(group);
  } catch (error) {
    return reply.code(400).send(error);
  }
}

// add members to group
export async function addMembersToGroupHandler(
  request: FastifyRequest<{ Body: GroupAddMembersInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const group = await addMembersToGroup(body);
    return reply.code(201).send(group);
  } catch (error) {
    return reply.code(400).send(error);
  }
}

export async function addMemberToGroupHandler(
  request: FastifyRequest<{ Body: GroupAddMemberInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const group = await addMemberToGroup(body);
    return reply.code(201).send(group);
  } catch (error) {
    return reply.code(400).send(error);
  }
}

// get groups for a given user
export async function getGroupsHandler(
  request: FastifyRequest<{ Body: { user_id: number } }>,
  reply: FastifyReply
) {
  const user_id = request.body.user_id;

  try {
    const groups = await getGroupsForUser(user_id);
    return reply.code(200).send(groups);
  } catch (error) {
    return reply.code(400).send(error);
  }
}

export async function getDiffieKey(
  request: FastifyRequest<{ Body: GetGroupKeysInput }>,
  reply: FastifyReply
) {
  try {
    const key = await getGroupKeys(request.body);
    return reply.code(200).send(key);
  } catch (error) {
    return reply.code(400).send(error);
  }
}
