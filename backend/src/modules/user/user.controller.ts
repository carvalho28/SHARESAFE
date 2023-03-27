import { createUser, findUserByEmail, findUsers } from "./user.service";
import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, LoginInput } from "./user.schema";
import { comparePassword } from "../../utils/hash";

export async function getUsersHandler() {
  const users = await findUsers();
  return users;
}

export async function registerUserHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const user = await createUser(body);
    return reply.code(201).send(user);
  } catch (error) {
    return reply.code(400).send(error);
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply
) {
  const body = request.body;

  // find by email
  const user = await findUserByEmail(body.email);
  if (!user) {
    return reply.code(401).send("User not found");
  }

  // compare password -> generate token -> return token
  const correctPassword = await comparePassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password,
  });

  if (correctPassword) {
    const { password, salt, ...rest } = user;

    return { accessToken: request.jwt.sign(rest) };
  }

  return reply.code(401).send("Invalid login credentials");
}
