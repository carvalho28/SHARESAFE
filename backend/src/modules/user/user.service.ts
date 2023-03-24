import prisma from "../../utils/prisma";
import { hashPassword } from "../../utils/hash";
import { CreateUserInput } from "./user.schema";

export async function findUsers() {
  return prisma.user.findMany();
}

export async function createUser(input: CreateUserInput) {
  const { password, ...rest } = input;

  const { hash, salt } = hashPassword(password);

  const user = await prisma.user.create({
    data: {
      ...rest,
      salt,
      password: hash,
    },
  });

  return user;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}
