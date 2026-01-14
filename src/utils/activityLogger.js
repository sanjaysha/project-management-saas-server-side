import { Activity } from "../models/activity.model.js";

export const logActivity = async ({
  workspaceId,
  userId,
  entityType,
  entityId,
  action,
  metadata = {},
}) => {
  try {
    await Activity.create({
      workspaceId,
      userId,
      entityType,
      entityId,
      action,
      metadata,
    });
  } catch (error) {
    // Never break main flow
    console.error("Activity log failed:", error.message);
  }
};
