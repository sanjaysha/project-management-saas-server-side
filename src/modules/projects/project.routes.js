import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { create, list, update, remove } from "./project.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createProjectSchema,
  updateProjectSchema,
  listProjectsSchema,
  deleteProjectSchema,
} from "../../validators/project.schema.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize("ADMIN", "MANAGER"),
  validate(createProjectSchema),
  create
);

router.get(
  "/",
  authorize("ADMIN", "MANAGER", "MEMBER"),
  validate(listProjectsSchema, "query"),
  list
);

router.put(
  "/:projectId",
  authorize("ADMIN", "MANAGER"),
  validate(updateProjectSchema),
  update
);

router.delete(
  "/:projectId",
  authorize("ADMIN"),
  validate(deleteProjectSchema, "params"),
  remove
);

export default router;
