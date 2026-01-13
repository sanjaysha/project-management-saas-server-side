import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "./project.service.js";

export const create = asyncHandler(async (req, res) => {
  const project = await createProject({
    workspaceId: req.body.workspaceId,
    name: req.body.name,
    description: req.body.description,
    userId: req.user.userId,
  });

  res.status(201).json({ success: true, data: project });
});

export const list = asyncHandler(async (req, res) => {
  const data = await getProjects({
    workspaceId: req.query.workspaceId,
    page: Number(req.query.page || 1),
    limit: Number(req.query.limit || 10),
  });

  res.status(200).json({ success: true, data });
});

export const update = asyncHandler(async (req, res) => {
  const project = await updateProject({
    projectId: req.params.projectId,
    workspaceId: req.body.workspaceId,
    data: req.body,
  });

  res.status(200).json({ success: true, data: project });
});

export const remove = asyncHandler(async (req, res) => {
  await deleteProject({
    projectId: req.params.projectId,
    workspaceId: req.body.workspaceId,
  });

  res.status(204).send();
});
