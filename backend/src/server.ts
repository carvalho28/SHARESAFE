import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt, { JWT } from "@fastify/jwt";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
}

import dotenv from "dotenv";
dotenv.config();

function buildServer() {
  const server = Fastify();

  const defaultSecret = "secret";

  server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || defaultSecret,
  });

  server.decorate(
    "auth",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        return reply.send(err);
      }
    }
  );

  server.get("/", async (request, reply) => {
    return { status: "UP" };
  });

  server.addHook("preHandler", (request, reply, next) => {
    request.jwt = server.jwt;
    return next();
  });

  for (const schema of userSchemas) {
    server.addSchema(schema);
  }

  server.register(userRoutes, { prefix: "api/users" });

  server.setNotFoundHandler((request, reply) => {
    reply.code(404).send("Not found");
  });

  return server;
}

export default buildServer;
