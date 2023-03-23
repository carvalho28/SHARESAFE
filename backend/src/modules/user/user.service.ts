import prisma from "../../utils/prisma";
import { CreateUserSchema } from "./user.schema";

export async function findUsers() {
  return prisma.user.findMany();
}

export async function createUser(input: CreateUserSchema) {
  const user = await prisma.user.create({
    data: input,
  });
}
