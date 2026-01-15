import express from "express";
import { register, login, refresh, logout } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from "../../validators/auth.schema.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("/refresh", validate(refreshSchema), refresh);

router.post("/logout", validate(refreshSchema), logout);

export default router;
