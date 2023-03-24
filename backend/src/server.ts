import fastify from "fastify";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";

function buildServer() {
  const server = fastify();

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

export default buildServer;
