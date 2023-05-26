import { FastifyInstance } from "fastify";
import {
  createGroupHandler,
  getGroupsHandler,
  getUsersFromGroupHandler,
  getDiffieKey,
  removeUserFromGroupHandler,
  addMembersToGroupHandler,
  addMemberToGroupHandler,
} from "./group.controller";

async function groupRoutes(server: FastifyInstance) {
  server.post("/new", { preHandler: [server.auth] }, createGroupHandler);
  server.post("/getGroups", { preHandler: [server.auth] }, getGroupsHandler);
  server.post(
    "/getUsers",
    { preHandler: [server.auth] },
    getUsersFromGroupHandler
  );
  server.post("/getDiffieKey", { preHandler: [server.auth] }, getDiffieKey);
  server.post(
    "/removeUserFromGroup",
    { preHandler: [server.auth] },
    removeUserFromGroupHandler
  );
  server.post(
    "/addMembersToGroup",
    { preHandler: [server.auth] },
    addMembersToGroupHandler
  );
  server.post(
    "/addMemberToGroup",
    { preHandler: [server.auth] },
    addMemberToGroupHandler
  );
}

export default groupRoutes;
