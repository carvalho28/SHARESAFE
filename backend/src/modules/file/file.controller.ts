import { FastifyReply, FastifyRequest } from "fastify";
import { FileInput } from "./file.schema";
import { uploadFile } from "./file.service";

export async function uploadFileHandler(
  request: FastifyRequest<{ Body: FileInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const file = await uploadFile(body);
    return reply.code(201).send(file);
  } catch (error) {
    return reply.code(400).send(error);
  }
}
