import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import fastifyJwt, { JWT } from "@fastify/jwt";
import userRoutes from "./modules/user/user.route";
import fileRoutes from "./modules/file/file.route";
import groupRoutes from "./modules/group/group.route";
import { userSchemas } from "./modules/user/user.schema";

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authentication: any;
  }
}

import dotenv from "dotenv";
dotenv.config();

function buildServer() {
  const server = Fastify();

  const defaultSecret = "secret";

  server.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || defaultSecret,
  });

  server.decorate(
    "authentication",
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

  server.register(userRoutes, { prefix: "/api/users" });
  server.register(fileRoutes, { prefix: "/api/files" });
  server.register(groupRoutes, { prefix: "/api/groups" });

  server.setNotFoundHandler((request, reply) => {
    reply.code(404).send("Not found");
  });

  return server;
}

export default buildServer;
