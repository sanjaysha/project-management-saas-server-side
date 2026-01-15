import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { list } from "./activity.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { listActivitiesSchema } from "../../validators/activity.schema.js";

const router = express.Router();

router.use(authenticate);

// router.get("/", authorize("ADMIN", "MANAGER"), list);
router.get(
  "/",
  authorize("ADMIN", "MANAGER"),
  validate(listActivitiesSchema, "query"),
  list
);

export default router;
