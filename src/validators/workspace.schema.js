import { z } from "zod";
import { objectId } from "./common.js";

export const createWorkspaceSchema = z.object({
  name: z.string().min(3).max(100),
});

export const inviteMemberSchema = z.object({
  workspaceId: objectId,
  email: z.string().email(),
  role: z.enum(["ADMIN", "MANAGER", "MEMBER"]),
});
