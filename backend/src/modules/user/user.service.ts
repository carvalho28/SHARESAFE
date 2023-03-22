import prisma from "../../utils/prisma";

export async function findUsers() {
  return prisma.user.findMany();
}
