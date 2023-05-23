import { FastifyInstance } from "fastify";
import { createGroupHandler, getGroupsHandler, getUsersFromGroupHandler } from "./group.controller";

async function groupRoutes(server: FastifyInstance) {
  server.post("/new", createGroupHandler);
  server.post("/getGroups", getGroupsHandler);
  server.post("/getUsers", getUsersFromGroupHandler);
}

export default groupRoutes;
