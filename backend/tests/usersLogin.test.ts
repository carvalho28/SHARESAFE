import { test } from "tap";
import { faker } from "@faker-js/faker";
import buildServer from "../src/server";
import prisma from "../src/utils/prisma";
import { User } from "@prisma/client";

test("POST /api/users/login", async (t) => {
  test("email and password correct", async (t) => {
    const name = faker.name.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const public_key = faker.random.alphaNumeric(64);

    const fastify = buildServer();

    t.teardown(async () => {
      fastify.close();
      await prisma.user.delete({
        where: {
          email: email,
        },
      });
    });

    await fastify.inject({
      method: "POST",
      url: "/api/users/register",
      payload: {
        email,
        name,
        password,
        public_key,
      },
    });

    const response = await fastify.inject({
      method: "POST",
      url: "/api/users/login",
      payload: {
        email,
        password,
      },
    });

    t.equal(response.statusCode, 200);

    const verification = fastify.jwt.verify<User>(response.json().accessToken);

    t.equal(verification.email, email);
    t.equal(verification.name, name);
    t.equal(verification.public_key, public_key);
    t.type(verification.id, "number");
  });

  test("email and password incorrect", async (t) => {
    const name = faker.name.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const public_key = faker.random.alphaNumeric(64);

    const fastify = buildServer();

    t.teardown(async () => {
      fastify.close();
      await prisma.user.delete({
        where: {
          email: email,
        },
      });
    });

    await fastify.inject({
      method: "POST",
      url: "/api/users/register",
      payload: {
        email,
        name,
        password,
        public_key,
      },
    });

    const response = await fastify.inject({
      method: "POST",
      url: "/api/users/login",
      payload: {
        email,
        password: "wrong password",
      },
    });

    t.equal(response.statusCode, 401);

    // t.equal(json.message, "Invalid login credentials");
  });

  test("email does not exist", async (t) => {
    const name = faker.name.fullName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const public_key = faker.random.alphaNumeric(64);

    const fastify = buildServer();

    t.teardown(async () => {
      fastify.close();
    });

    const response = await fastify.inject({
      method: "POST",
      url: "/api/users/login",
      payload: {
        email: email,
        password,
      },
    });

    t.equal(response.statusCode, 401);
  });
});
