import { createUser, findUsers } from "./user.service";
import dotenv from "dotenv";
import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput } from "./user.schema";

dotenv.config();

export async function getUsersHandler() {
  const users = await findUsers();
  return users;
}

export async function registerUserHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) {
  const body = request.body;
  console.log(body);

  try {
    const user = await createUser(body);

    return reply.code(201).send(user);
  } catch (error) {
    console.log(error);
    return reply.code(400).send(error);
  }
}
