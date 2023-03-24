import { FastifyInstance } from "fastify";
import { getUsersHandler, registerUserHandler } from "./user.controller";
import { $ref } from "./user.schema";

async function userRoutes(server: FastifyInstance) {
  server.get("/", getUsersHandler);

  server.post(
    "/register",
    {
      schema: {
        body: $ref("createUserSchema"),
        response: {
          201: $ref("createUserResponseSchema"),
        },
      },
    },
    registerUserHandler
  );
}

export default userRoutes;
