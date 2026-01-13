import { Task } from "../../models/task.model.js";
import { ApiError } from "../../utils/ApiError.js";

export const createTask = async ({
  workspaceId,
  projectId,
  title,
  description,
  priority,
  assigneeId,
  userId,
}) => {
  // Determine next position in TODO column
  const lastTask = await Task.findOne({
    projectId,
    status: "TODO",
    isDeleted: false,
  }).sort({ position: -1 });

  const nextPosition = lastTask ? lastTask.position + 1 : 1;

  return Task.create({
    workspaceId,
    projectId,
    title,
    description,
    priority,
    assigneeId,
    createdBy: userId,
    position: nextPosition,
  });
};

export const getTasksByProject = async ({ workspaceId, projectId }) => {
  return Task.find({
    workspaceId,
    projectId,
    isDeleted: false,
  }).sort({ status: 1, position: 1 });
};

export const updateTask = async ({ taskId, workspaceId, data }) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, workspaceId, isDeleted: false },
    data,
    { new: true }
  );

  if (!task) {
    throw new ApiError(404, "Task not found", "TASK_NOT_FOUND");
  }

  return task;
};

export const updateTaskStatus = async ({
  taskId,
  workspaceId,
  status,
  position,
}) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, workspaceId, isDeleted: false },
    { status, position },
    { new: true }
  );

  if (!task) {
    throw new ApiError(404, "Task not found", "TASK_NOT_FOUND");
  }

  return task;
};

export const deleteTask = async ({ taskId, workspaceId }) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, workspaceId },
    { isDeleted: true },
    { new: true }
  );

  if (!task) {
    throw new ApiError(404, "Task not found", "TASK_NOT_FOUND");
  }
};
