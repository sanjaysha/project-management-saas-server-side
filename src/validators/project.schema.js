import { z } from "zod";
import { objectId, pagination } from "./common.js";

export const createProjectSchema = z.object({
  workspaceId: objectId,
  name: z.string().min(3).max(150),
  description: z.string().optional(),
});

export const updateProjectSchema = z.object({
  workspaceId: objectId,
  name: z.string().min(3).max(150).optional(),
  description: z.string().optional(),
});

export const listProjectsSchema = z.object({
  workspaceId: objectId,
  ...pagination,
});

export const deleteProjectSchema = z.object({
  projectId: objectId,
});
