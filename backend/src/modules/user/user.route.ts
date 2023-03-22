import { FastifyInstance } from "fastify";
import { getUsersHandler } from "./user.controller";

async function userRoute(server: FastifyInstance) {
  server.get("/", getUsersHandler);
}

export default userRoute;
