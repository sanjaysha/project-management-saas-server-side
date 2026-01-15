import { z } from "zod";
import { objectId, pagination } from "./common.js";

export const listActivitiesSchema = z.object({
  workspaceId: objectId,
  ...pagination,
});
