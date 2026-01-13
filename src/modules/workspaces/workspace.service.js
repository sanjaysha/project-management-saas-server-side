import mongoose from "mongoose";
import { Workspace } from "../../models/workspace.model.js";
import { WorkspaceMember } from "../../models/workspaceMember.model.js";
import { ApiError } from "../../utils/ApiError.js";

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

export const inviteMember = async ({ workspaceId, email, role }) => {
  const user = await import("../../models/user.model.js")
    .then((m) => m.User)
    .then((User) => User.findOne({ email }));

  if (!user) {
    throw new ApiError(404, "User not found", "USER_NOT_FOUND");
  }

  return WorkspaceMember.create({
    workspaceId,
    userId: user._id,
    role,
  });
};
