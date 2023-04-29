import { FastifyReply, FastifyRequest } from "fastify";
import { GroupAddFilesInput, GroupAddMembersInput, GroupInput } from "./group.schema";
import { addFilesToGroup, addMembersToGroup, createGroup } from "./group.service";

export async function createGroupHandler(
  request: FastifyRequest<{ Body: GroupInput }>,
  reply: FastifyReply
) {
  const body = request.body;
  console.log(body);

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
