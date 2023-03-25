import { test } from "tap";
import buildServer from "../src/server";

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
