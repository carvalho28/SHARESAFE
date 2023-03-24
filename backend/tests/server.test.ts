import { test } from "tap";
import { buildServer } from "../src/server";

// test root
test("GET /", async (t) => {
  const fastify = buildServer();

  t.teardown(() => {
    fastify.close();
  });

  const response = await fastify.inject({
    method: "GET",
    url: "/",
  });

  t.equal(response.statusCode, 200);
  t.same("Hello World!", response.payload);
});

// test 404
test("GET /notfound", async (t) => {
  const fastify = buildServer();

  t.teardown(() => {
    fastify.close();
  });

  const response = await fastify.inject({
    method: "GET",
    url: "/notfound",
  });

  t.equal(response.statusCode, 404);
  t.same("Not found", response.payload);
});

test("GET /api/users", async (t) => {
  const fastify = buildServer();

  t.teardown(() => {
    fastify.close();
  });

  const response = await fastify.inject({
    method: "GET",
    url: "/api/users",
  });

  t.equal(response.statusCode, 200);
});
