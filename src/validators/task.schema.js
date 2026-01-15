import { z } from "zod";
import { objectId } from "./common.js";

export const createTaskSchema = z.object({
  workspaceId: objectId,
  projectId: objectId,
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  assigneeId: objectId.optional(),
});

export const updateTaskStatusSchema = z.object({
  workspaceId: objectId,
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  position: z.number().int().min(1),
});

export const taskIdParamSchema = z.object({
  taskId: objectId,
});

export const listTasksSchema = z.object({
  workspaceId: objectId,
  projectId: objectId,
});

export const updateTaskSchema = z.object({
  workspaceId: objectId,
  title: z.string().min(3).max(200).optional(),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  assigneeId: objectId.optional(),
});
