import { asyncHandler } from "../../utils/asyncHandler.js";
import { registerUser, loginUser } from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const data = await registerUser(req.body);
  res.status(201).json({ success: true, data });
});

export const login = asyncHandler(async (req, res) => {
  const data = await loginUser(req.body);
  res.status(200).json({ success: true, data });
});

export const refresh = asyncHandler(async (req, res) => {
  const data = await refreshAccessToken({
    refreshToken: req.body.refreshToken,
    ip: req.ip,
  });

  res.status(200).json({ success: true, data });
});

export const logout = asyncHandler(async (req, res) => {
  await logoutUser({
    refreshToken: req.body.refreshToken,
    ip: req.ip,
  });

  res.status(204).send();
});
