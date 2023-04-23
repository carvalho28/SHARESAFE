import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const fileUploadCore = z.object({
  file_info: z.object({
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
    user_id: z.number(),
  }),

  // users_group as an array of strings
  users_group: z.array(z.any()),
});

export type FileInput = z.infer<typeof fileUploadCore>;

export const { schemas: fileSchemas, $ref } = buildJsonSchemas({
  fileUploadCore
});
