import fastify from "fastify";
import userRoutes from "./modules/user/user.route";

function buildServer() {
  const server = fastify();

  server.get("/", async (request, reply) => {
    return "Hello World!";
  });

  server.register(userRoutes, { prefix: "/api/users" });

  server.setNotFoundHandler((request, reply) => {
    reply.code(404).send("Not found");
  });

  return server;
}

export default buildServer;
