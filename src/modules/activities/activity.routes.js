import express from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { list } from "./activity.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/", authorize("ADMIN", "MANAGER"), list);

export default router;
