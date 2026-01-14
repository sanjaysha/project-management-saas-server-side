import { asyncHandler } from "../../utils/asyncHandler.js";
import { getActivities } from "./activity.service.js";

export const list = asyncHandler(async (req, res) => {
  const data = await getActivities({
    workspaceId: req.query.workspaceId,
    page: Number(req.query.page || 1),
    limit: Number(req.query.limit || 20),
  });

  res.status(200).json({ success: true, data });
});
