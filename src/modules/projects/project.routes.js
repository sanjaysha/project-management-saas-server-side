import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { create, list, update, remove } from "./project.controller.js";

const router = express.Router();

router.use(authenticate);

// ADMIN + MANAGER
router.post("/", authorize("ADMIN", "MANAGER"), create);
router.get("/", authorize("ADMIN", "MANAGER", "MEMBER"), list);
router.put("/:projectId", authorize("ADMIN", "MANAGER"), update);
router.delete("/:projectId", authorize("ADMIN"), remove);

export default router;
