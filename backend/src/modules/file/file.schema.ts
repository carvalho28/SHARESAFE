import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const fileSchema = z.object({
  file_name: z.string({
    required_error: "File name is required",
  }),
  file_type: z.string({
    required_error: "File type is required",
  }),
  file_size: z.number({
    required_error: "File size is required",
  }),
  encrypted_file: z.any(),
  iv: z.any(),
  created_at: z.date(),
  user_id: z.number(),
});

export type FileInput = z.infer<typeof fileSchema>;

export const { schemas: fileSchemas, $ref } = buildJsonSchemas({
  fileSchema,
});
