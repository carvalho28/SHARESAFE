import { FastifyInstance } from "fastify";
import {
  uploadFileHandler,
  receiveFileHandler,
  deleteFileHandler,
} from "./file.controller";

async function fileRoutes(server: FastifyInstance) {
  server.post(
    "/upload",
    { preHandler: [server.authentication] },
    uploadFileHandler
  );
  server.post(
    "/receive",
    { preHandler: [server.authentication] },
    receiveFileHandler
  );
  server.delete(
    "/delete",
    { preHandler: [server.authentication] },
    deleteFileHandler
  );
}

export default fileRoutes;
