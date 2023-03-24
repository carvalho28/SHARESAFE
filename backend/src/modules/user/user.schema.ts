import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const userCore = {
  name: z.string({
    required_error: "Name is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  public_key: z.string({
    required_error: "Public key is required",
  }),
};

const createUserSchema = z.object({
  ...userCore,
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(8),
});

const createUserResponseSchema = z.object({
  id: z.number(),
  ...userCore,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  createUserResponseSchema,
});
