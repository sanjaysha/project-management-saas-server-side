import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import crypto from "crypto";

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.jwtAccessSecret);
};

export const generateRefreshTokenValue = () => {
  return crypto.randomBytes(64).toString("hex");
};
