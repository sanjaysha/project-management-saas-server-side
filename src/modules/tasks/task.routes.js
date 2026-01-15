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
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createTaskSchema,
  updateTaskStatusSchema,
  updateTaskSchema,
  listTasksSchema,
  taskIdParamSchema,
} from "../../validators/task.schema.js";

const router = express.Router();

router.use(authenticate);

// CREATE task
router.post(
  "/",
  authorize("ADMIN", "MANAGER"),
  validate(createTaskSchema),
  create
);

// LIST tasks (Kanban)
router.get(
  "/",
  authorize("ADMIN", "MANAGER", "MEMBER"),
  validate(listTasksSchema, "query"),
  list
);

// UPDATE task (title, desc, etc.)
router.put(
  "/:taskId",
  authorize("ADMIN", "MANAGER"),
  validate(taskIdParamSchema, "params"),
  validate(updateTaskSchema),
  update
);

// MOVE task (Kanban)
router.patch(
  "/:taskId/status",
  authorize("ADMIN", "MANAGER", "MEMBER"),
  validate(taskIdParamSchema, "params"),
  validate(updateTaskStatusSchema),
  updateStatus
);

// DELETE task
router.delete(
  "/:taskId",
  authorize("ADMIN", "MANAGER"),
  validate(taskIdParamSchema, "params"),
  remove
);

export default router;
