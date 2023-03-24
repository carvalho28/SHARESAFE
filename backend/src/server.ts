import fastify, { FastifyReply, FastifyRequest } from "fastify";
import userRoutes from "./modules/user/user.route";
import fastifyJwt from "@fastify/jwt";
import dotenv from "dotenv";
import { userSchemas } from "./modules/user/user.schema";

dotenv.config();

function buildServer() {
  const server = fastify();

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

  for (const schema of userSchemas) {
    server.addSchema(schema);
  }

  server.get("/", async (request, reply) => {
    return { status: "UP" };
  });

  server.register(userRoutes, { prefix: "/api/users" });

  server.setNotFoundHandler((request, reply) => {
    reply.code(404).send("Not found");
  });

  return server;
}

export { buildServer };
