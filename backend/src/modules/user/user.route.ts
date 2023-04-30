import { FastifyInstance } from "fastify";
import {
  getUsersHandler,
  loginHandler,
  registerUserHandler,
  verifyAccessTokenHandler,
} from "./user.controller";
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

  server.post(
    "/login",
    {
      schema: {
        body: $ref("loginSchema"),
        response: {
          201: $ref("loginResponseSchema"),
        },
      },
    },
    loginHandler
  );

  server.post("/verify", verifyAccessTokenHandler);
}

export default userRoutes;
