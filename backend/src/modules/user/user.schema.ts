import { z } from "zod";

const createUserSchema = z.object({
  name: z.string(),
});

export { createUserSchema };
