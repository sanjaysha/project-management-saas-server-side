import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import {
  create,
  list,
  update,
  updateStatus,
  remove,
} from "./task.controller.js";

const router = express.Router();

router.use(authenticate);

// ADMIN + MANAGER
router.post("/", authorize("ADMIN", "MANAGER"), create);
router.put("/:taskId", authorize("ADMIN", "MANAGER"), update);
router.delete("/:taskId", authorize("ADMIN", "MANAGER"), remove);

// All members can move tasks
router.patch(
  "/:taskId/status",
  authorize("ADMIN", "MANAGER", "MEMBER"),
  updateStatus
);

// All members can view tasks
router.get("/", authorize("ADMIN", "MANAGER", "MEMBER"), list);

export default router;
