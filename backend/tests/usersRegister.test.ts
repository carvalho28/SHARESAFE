import { test } from "tap";
import { ImportMock } from "ts-mock-imports";
import { faker } from "@faker-js/faker";
import buildServer from "../src/server";
import * as userService from "../src/modules/user/user.service";
import prisma from "../src/utils/prisma";

test("POST /api/users/register - create a user with mock createUser", async (t) => {
  // create a fake user
  const name = faker.name.fullName();
  const email = faker.internet.email();
  const password = faker.internet.password();
  const public_key = faker.random.alphaNumeric(64);
  const id = Math.floor(Math.random() * 1000);

  const fastify = buildServer();

  t.teardown(() => {
    fastify.close();
    stub.restore();
  });

  // simulate a user being created
  const stub = ImportMock.mockFunction(userService, "createUser", {
    id,
    email,
    name,
    password,
    public_key,
  });

  // make the request
  const response = await fastify.inject({
    method: "POST",
    url: "/api/users/register",
    payload: {
      email,
      name,
      password,
      public_key,
    },
  });

  // assertions
  t.equal(response.statusCode, 201);
  t.same(response.headers["content-type"], "application/json; charset=utf-8");

  const json = response.json();

  t.same(json.name, name);
  t.same(json.email, email);
  t.same(json.public_key, public_key);
  t.same(json.id, id);
});

test("POST /api/users/register - create a user in the database", async (t) => {
  // create a fake user
  const name = faker.name.fullName();
  const email = faker.internet.email();
  const password = faker.internet.password();
  const public_key = faker.random.alphaNumeric(64);

  const fastify = buildServer();

  t.teardown(async () => {
    fastify.close();
    await prisma.user.delete({
      where: {
        email,
      },
    });
  });

  // make the request
  const response = await fastify.inject({
    method: "POST",
    url: "/api/users/register",
    payload: {
      email,
      name,
      password,
      public_key,
    },
  });

  // assertions
  t.equal(response.statusCode, 201);
  t.same(response.headers["content-type"], "application/json; charset=utf-8");

  const json = response.json();

  t.same(json.name, name);
  t.same(json.email, email);
  t.same(json.public_key, public_key);
  t.type(json.id, "number");

});

test("POST /api/users/register - fails to create a user", async (t) => {
  // create a fake user
  const name = faker.name.fullName();
  const password = faker.internet.password();
  const public_key = faker.random.alphaNumeric(64);

  const fastify = buildServer();

  t.teardown(async () => {
    fastify.close();
  });

  // make the request
  const response = await fastify.inject({
    method: "POST",
    url: "/api/users/register",
    payload: {
      name,
      password,
      public_key,
    },
  });

  // assertions
  t.equal(response.statusCode, 400);
  t.same(response.headers["content-type"], "application/json; charset=utf-8");

  const json = response.json();

  t.same(json.message, "body must have required property 'email'");
});
