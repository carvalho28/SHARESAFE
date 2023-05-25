import { FastifyInstance } from "fastify";
import {
  createGroupHandler,
  getGroupsHandler,
  getUsersFromGroupHandler,
  getDiffieKey,
} from "./group.controller";

async function groupRoutes(server: FastifyInstance) {
  server.post("/new", createGroupHandler);
  server.post("/getGroups", getGroupsHandler);
  server.post("/getUsers", getUsersFromGroupHandler);
  server.post("/getDiffieKey", getDiffieKey);
}

export default groupRoutes;
