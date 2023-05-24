import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const groupCore = z.object({
  name: z.string(),
  // created_at: z.string(),
  members: z.array(z.any()),
});

// only add files to group
const groupAddFiles = z.object({
  id: z.number(),
  files: z.array(z.any()),
});

// only add members to group
const groupAddMembers = z.object({
  id: z.number(),
  members: z.array(z.any()),
});

const GetUserFromGroupSchema = z.object({
  group_id: z.number({
    required_error: "Group Id is required",
  }),
});

export type GroupInput = z.infer<typeof groupCore>;
export type GroupAddFilesInput = z.infer<typeof groupAddFiles>;
export type GroupAddMembersInput = z.infer<typeof groupAddMembers>;
export type GetUserFromGroupInput = z.infer<typeof GetUserFromGroupSchema>;

export const { schemas: groupSchemas, $ref } = buildJsonSchemas({
  groupCore,
  groupAddFiles,
  groupAddMembers,
  GetUserFromGroupSchema,
});
