import { FastifyInstance } from "fastify";
import {
  createGroupHandler,
  getGroupsHandler,
  getUsersFromGroupHandler,
  getDiffieKey,
  removeUserFromGroupHandler,
  addMembersToGroupHandler,
  addMemberToGroupHandler
} from "./group.controller";

async function groupRoutes(server: FastifyInstance) {
  server.post("/new", createGroupHandler);
  server.post("/getGroups", getGroupsHandler);
  server.post("/getUsers", getUsersFromGroupHandler);
  server.post("/getDiffieKey", getDiffieKey);
  server.post("/removeUserFromGroup", removeUserFromGroupHandler);
  server.post("/addMembersToGroup", addMembersToGroupHandler);
  server.post("/addMemberToGroup", addMemberToGroupHandler);
}

export default groupRoutes;
