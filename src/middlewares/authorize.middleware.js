import { WorkspaceMember } from "../models/workspaceMember.model.js";
import { ApiError } from "../utils/ApiError.js";

export const authorize =
  (...allowedRoles) =>
  async (req, res, next) => {
    const workspaceId =
      req.body?.workspaceId ||
      req.params?.workspaceId ||
      req.query?.workspaceId;

    const userId = req.user.userId;

    if (!workspaceId) {
      throw new ApiError(400, "Workspace ID is required", "WORKSPACE_REQUIRED");
    }

    const member = await WorkspaceMember.findOne({
      workspaceId,
      userId,
      isActive: true,
    });

    if (!member) {
      throw new ApiError(403, "Access denied", "FORBIDDEN");
    }

    if (!allowedRoles.includes(member.role)) {
      throw new ApiError(403, "Insufficient permissions", "FORBIDDEN");
    }

    req.workspaceMember = member;
    req.workspaceId = workspaceId; // ✅ useful downstream
    next();
  };
