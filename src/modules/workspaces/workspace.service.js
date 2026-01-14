import mongoose from "mongoose";
import { Workspace } from "../../models/workspace.model.js";
import { WorkspaceMember } from "../../models/workspaceMember.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { logActivity } from "../../utils/activityLogger.js";
import { User } from "../../models/user.model.js";

export const createWorkspace = async ({ name, userId }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const workspace = await Workspace.create([{ name, createdBy: userId }], {
      session,
    });

    await WorkspaceMember.create(
      [
        {
          workspaceId: workspace[0]._id,
          userId,
          role: "ADMIN",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    await logActivity({
      workspaceId: workspace[0]._id,
      userId,
      entityType: "WORKSPACE",
      entityId: workspace[0]._id,
      action: "CREATED",
      metadata: { name },
    });

    return workspace[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getUserWorkspaces = async (userId) => {
  return WorkspaceMember.find({ userId, isActive: true }).populate(
    "workspaceId",
    "name"
  );
};

export const inviteMember = async ({ workspaceId, email, role, inviterId }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found", "USER_NOT_FOUND");
  }

  const member = await WorkspaceMember.create({
    workspaceId,
    userId: user._id,
    role,
  });

  // ✅ Activity log AFTER successful change
  await logActivity({
    workspaceId,
    userId: inviterId,
    entityType: "WORKSPACE",
    entityId: workspaceId,
    action: "MEMBER_INVITED",
    metadata: {
      invitedUserId: user._id,
      role,
    },
  });

  return member;
};
