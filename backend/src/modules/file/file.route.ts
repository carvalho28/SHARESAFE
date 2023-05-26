import { FastifyInstance } from "fastify";
import {
  uploadFileHandler,
  receiveFileHandler,
  deleteFileHandler,
} from "./file.controller";

async function fileRoutes(server: FastifyInstance) {
  server.post("/upload", { preHandler: [server.auth] }, uploadFileHandler);
  server.post("/receive", { preHandler: [server.auth] }, receiveFileHandler);
  server.delete("/delete", { preHandler: [server.auth] }, deleteFileHandler);
}

export default fileRoutes;
