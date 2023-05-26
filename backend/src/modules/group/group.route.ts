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
  server.post(
    "/new",
    { preHandler: [server.authentication] },
    createGroupHandler
  );
  server.post(
    "/getGroups",
    { preHandler: [server.authentication] },
    getGroupsHandler
  );
  server.post(
    "/getUsers",
    { preHandler: [server.authentication] },
    getUsersFromGroupHandler
  );
  server.post(
    "/getDiffieKey",
    { preHandler: [server.authentication] },
    getDiffieKey
  );
  server.post(
    "/removeUserFromGroup",
    { preHandler: [server.authentication] },
    removeUserFromGroupHandler
  );
  server.post(
    "/addMembersToGroup",
    { preHandler: [server.authentication] },
    addMembersToGroupHandler
  );
  server.post(
    "/addMemberToGroup",
    { preHandler: [server.authentication] },
    addMemberToGroupHandler
  );
}

export default groupRoutes;
