import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  createWorkspace,
  getUserWorkspaces,
  inviteMember,
} from "./workspace.service.js";

export const create = asyncHandler(async (req, res) => {
  const workspace = await createWorkspace({
    name: req.body.name,
    userId: req.user.userId,
  });

  res.status(201).json({
    success: true,
    data: workspace,
  });
});

export const list = asyncHandler(async (req, res) => {
  const workspaces = await getUserWorkspaces(req.user.userId);
  res.status(200).json({ success: true, data: workspaces });
});

export const invite = asyncHandler(async (req, res) => {
  const member = await inviteMember({
    workspaceId: req.body.workspaceId,
    email: req.body.email,
    role: req.body.role,
    inviterId: req.user.userId, // ✅ pass explicitly
  });

  res.status(201).json({ success: true, data: member });
});
