import { FastifyReply, FastifyRequest } from "fastify";
import { FileInput, FileReceive } from "./file.schema";
import { uploadFile, receiveFile } from "./file.service";

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

export async function receiveFileHandler(
  request: FastifyRequest<{ Body: FileReceive }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const files = await receiveFile(body);
    return reply.code(201).send(files);
  } catch (error) {
    return reply.code(400).send(error);
  }
}
