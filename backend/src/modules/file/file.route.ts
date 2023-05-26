import { FastifyInstance } from "fastify";
import {
  uploadFileHandler,
  receiveFileHandler,
  deleteFileHandler,
} from "./file.controller";

async function fileRoutes(server: FastifyInstance) {
  server.post("/upload", uploadFileHandler);
  server.post("/receive", receiveFileHandler);
  server.delete("/delete", deleteFileHandler);
}

export default fileRoutes;
