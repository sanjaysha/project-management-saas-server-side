import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { create, list, invite } from "./workspace.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createWorkspaceSchema,
  inviteMemberSchema,
} from "../../validators/workspace.schema.js";

const router = express.Router();

router.use(authenticate);

// CREATE workspace
router.post("/", validate(createWorkspaceSchema), create);

// LIST workspaces (no input → no validation)
router.get("/", list);

// INVITE member
router.post(
  "/invite",
  authorize("ADMIN"),
  validate(inviteMemberSchema),
  invite
);

export default router;
