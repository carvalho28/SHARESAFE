import { FastifyInstance } from "fastify";
import { uploadFileHandler } from "./file.controller";

async function fileRoutes(server: FastifyInstance) {
  server.post("/upload", uploadFileHandler);
}

export default fileRoutes;
