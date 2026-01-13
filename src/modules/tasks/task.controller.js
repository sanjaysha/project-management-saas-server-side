import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createTask,
  getTasksByProject,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "./task.service.js";

export const create = asyncHandler(async (req, res) => {
  const task = await createTask({
    ...req.body,
    userId: req.user.userId,
  });

  res.status(201).json({ success: true, data: task });
});

export const list = asyncHandler(async (req, res) => {
  const tasks = await getTasksByProject({
    workspaceId: req.query.workspaceId,
    projectId: req.query.projectId,
  });

  res.status(200).json({ success: true, data: tasks });
});

export const update = asyncHandler(async (req, res) => {
  const task = await updateTask({
    taskId: req.params.taskId,
    workspaceId: req.body.workspaceId,
    data: req.body,
  });

  res.status(200).json({ success: true, data: task });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const task = await updateTaskStatus({
    taskId: req.params.taskId,
    workspaceId: req.body.workspaceId,
    status: req.body.status,
    position: req.body.position,
  });

  res.status(200).json({ success: true, data: task });
});

export const remove = asyncHandler(async (req, res) => {
  await deleteTask({
    taskId: req.params.taskId,
    workspaceId: req.body.workspaceId,
  });

  res.status(204).send();
});
