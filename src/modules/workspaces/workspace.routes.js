import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { create, list, invite } from "./workspace.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/", create);
router.get("/", list);
router.post("/invite", authorize("ADMIN"), invite);

export default router;
