import { Task } from "../../models/task.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { logActivity } from "../../utils/activityLogger.js";

export const createTask = async ({
  workspaceId,
  projectId,
  title,
  description,
  priority,
  assigneeId,
  userId,
}) => {
  const lastTask = await Task.findOne({
    projectId,
    status: "TODO",
    isDeleted: false,
  }).sort({ position: -1 });

  const nextPosition = lastTask ? lastTask.position + 1 : 1;

  // ✅ Step 1: create task
  const task = await Task.create({
    workspaceId,
    projectId,
    title,
    description,
    priority,
    assigneeId,
    createdBy: userId,
    position: nextPosition,
  });

  // ✅ Step 2: log activity using task._id
  await logActivity({
    workspaceId,
    userId,
    entityType: "TASK",
    entityId: task._id,
    action: "CREATED",
    metadata: {
      title: task.title,
      projectId,
    },
  });

  return task;
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
  userId,
}) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, workspaceId, isDeleted: false },
    { status, position },
    { new: true }
  );

  if (!task) {
    throw new ApiError(404, "Task not found", "TASK_NOT_FOUND");
  }

  await logActivity({
    workspaceId,
    userId,
    entityType: "TASK",
    entityId: task._id,
    action: "STATUS_CHANGED",
    metadata: {
      status,
    },
  });

  return task;
};

export const deleteTask = async ({ taskId, workspaceId, userId }) => {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, workspaceId },
    { isDeleted: true },
    { new: true }
  );

  if (!task) {
    throw new ApiError(404, "Task not found", "TASK_NOT_FOUND");
  }

  await logActivity({
    workspaceId,
    userId,
    entityType: "TASK",
    entityId: task._id,
    action: "DELETED",
  });

  return task;
};
