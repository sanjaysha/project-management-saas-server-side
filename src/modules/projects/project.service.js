import { Project } from "../../models/project.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { logActivity } from "../../utils/activityLogger.js";

export const createProject = async ({
  workspaceId,
  name,
  description,
  userId,
}) => {
  // ✅ Step 1: create project
  const project = await Project.create({
    workspaceId,
    name,
    description,
    createdBy: userId,
  });

  // ✅ Step 2: log activity
  await logActivity({
    workspaceId,
    userId,
    entityType: "PROJECT",
    entityId: project._id,
    action: "CREATED",
    metadata: { name },
  });

  return project;
};

export const getProjects = async ({ workspaceId, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Project.find({ workspaceId, isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Project.countDocuments({ workspaceId, isDeleted: false }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
    },
  };
};

export const updateProject = async ({
  projectId,
  workspaceId,
  data,
  userId,
}) => {
  const project = await Project.findOneAndUpdate(
    { _id: projectId, workspaceId, isDeleted: false },
    data,
    { new: true }
  );

  if (!project) {
    throw new ApiError(404, "Project not found", "PROJECT_NOT_FOUND");
  }

  await logActivity({
    workspaceId,
    userId,
    entityType: "PROJECT",
    entityId: project._id,
    action: "UPDATED",
  });

  return project;
};

export const deleteProject = async ({ projectId, workspaceId, userId }) => {
  const project = await Project.findOneAndUpdate(
    { _id: projectId, workspaceId },
    { isDeleted: true },
    { new: true }
  );

  if (!project) {
    throw new ApiError(404, "Project not found", "PROJECT_NOT_FOUND");
  }

  await logActivity({
    workspaceId,
    userId,
    entityType: "PROJECT",
    entityId: project._id,
    action: "DELETED",
  });

  return project;
};
