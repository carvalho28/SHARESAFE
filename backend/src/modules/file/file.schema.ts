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
    algorithm: z.string(),
    signature: z.string(),
    signature_algorithm: z.string(),
    mac: z.string(),
    mac_algorithm: z.string(),
    group_id: z.number(),
  }),

  // users_group as an array of objects
  users_group: z.array(
    z.object({
      id: z.number(),
      encrypted_key: z.any(),
    })
  ),
});

const FileReceiveCore = z.object({
  id: z.number(),
});

export type FileInput = z.infer<typeof fileUploadCore>;
export type FileReceive = z.infer<typeof FileReceiveCore>;

export const { schemas: fileSchemas, $ref } = buildJsonSchemas({
  fileUploadCore,
  FileReceiveCore,
});
