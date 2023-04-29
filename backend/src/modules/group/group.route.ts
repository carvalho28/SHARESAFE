import { FastifyInstance } from "fastify";
import { createGroupHandler, getGroupsHandler } from "./group.controller";

async function groupRoutes(server: FastifyInstance) {
  server.post("/new", createGroupHandler);
  server.post("/getGroups", getGroupsHandler);
}

export default groupRoutes;
