import { test } from "tap";
import buildServer from "../src/server";
import prisma from "../src/utils/prisma";
import { faker } from "@faker-js/faker";

test("GET /api/groups/getGroups - get groups for a given user", async (t) => {
  const user_id = await prisma.user.findFirst({
    select: {
      id: true,
    },
  });

  const fastify = buildServer();

  t.teardown(() => {
    fastify.close();
  });

  const response = await fastify.inject({
    method: "POST",
    url: "/api/groups/getGroups",
    payload: {
      user_id: user_id?.id,
    },
  });

  t.equal(response.statusCode, 200);
  t.same(response.headers["content-type"], "application/json; charset=utf-8");
});

test("POST /api/groups/new - create a new group", async (t) => {
  let group_id: number;
  const name = faker.name.jobDescriptor();
  const files: number[] = [];
  const members: number[] = [];

  const fastify = buildServer();

  t.teardown(async () => {
    fastify.close();
    await prisma.group.delete({
      where: {
        id: group_id,
      },
    });
  });

  const response = await fastify.inject({
    method: "POST",
    url: "/api/groups/new",
    payload: {
      name,
      files,
      members,
    },
  });

  t.equal(response.statusCode, 201);
  t.same(response.headers["content-type"], "application/json; charset=utf-8");

  const json = response.json();
  group_id = json.id;
});
