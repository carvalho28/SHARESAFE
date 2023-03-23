import { FastifyInstance } from "fastify";
import { getUsersHandler, registerUserHandler } from "./user.controller";

async function userRoutes(server: FastifyInstance) {
  server.get("/", getUsersHandler);

  server.get("/key", registerUserHandler);
}

export default userRoutes;
