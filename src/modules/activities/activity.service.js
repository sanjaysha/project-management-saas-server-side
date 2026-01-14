import { Activity } from "../../models/activity.model.js";

export const getActivities = async ({ workspaceId, page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Activity.find({ workspaceId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name"),
    Activity.countDocuments({ workspaceId }),
  ]);

  return {
    items,
    pagination: { page, limit, total },
  };
};
