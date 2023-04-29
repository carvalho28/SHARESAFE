import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const groupCore = z.object({
  name: z.string(),
  created_at: z.string(),
  files: z.array(z.any()),
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

export type GroupInput = z.infer<typeof groupCore>;
export type GroupAddFilesInput = z.infer<typeof groupAddFiles>;
export type GroupAddMembersInput = z.infer<typeof groupAddMembers>;

export const { schemas: groupSchemas, $ref } = buildJsonSchemas({
  groupCore,
  groupAddFiles,
  groupAddMembers,
});
