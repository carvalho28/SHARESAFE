import { FastifyInstance } from "fastify";
import { uploadFileHandler, receiveFileHandler } from "./file.controller";

async function fileRoutes(server: FastifyInstance) {
  server.post("/upload", uploadFileHandler);
  server.get("/receive", receiveFileHandler);
}

export default fileRoutes;
