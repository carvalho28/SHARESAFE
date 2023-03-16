import fastify from "fastify";

function buildServer() {
  const server = fastify();

  server.get("/", async (request, reply) => {
    return "Hello World!";
  });

  server.setNotFoundHandler((request, reply) => {
    reply.code(404).send("Not found");
  });

  return server;
}

export default buildServer;
