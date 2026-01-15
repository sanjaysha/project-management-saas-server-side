import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateRefreshTokenValue,
} from "../../utils/token.js";
import { RefreshToken } from "../../models/refreshToken.model.js";

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email already registered", "EMAIL_EXISTS");
  }

  const user = await User.create({
    name,
    email,
    passwordHash: password,
  });

  return {
    id: user._id,
    email: user.email,
  };
};

// export const loginUser = async ({ email, password }) => {
//   const user = await User.findOne({ email }).select("+passwordHash");
//   if (!user || !(await user.comparePassword(password))) {
//     throw new ApiError(401, "Invalid credentials", "INVALID_CREDENTIALS");
//   }

//   const accessToken = generateAccessToken({ userId: user._id });
//   const refreshToken = generateRefreshToken({ userId: user._id });

//   return {
//     accessToken,
//     refreshToken,
//     user: {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//     },
//   };
// };

export const loginUser = async ({ email, password, ip }) => {
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid credentials", "INVALID_CREDENTIALS");
  }

  const accessToken = generateAccessToken({ userId: user._id });

  const refreshTokenValue = generateRefreshTokenValue();
  const refreshTokenHash = RefreshToken.hash(refreshTokenValue);

  await RefreshToken.create({
    userId: user._id,
    tokenHash: refreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ip,
  });

  return {
    accessToken,
    refreshToken: refreshTokenValue,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

export const refreshAccessToken = async ({ refreshToken, ip }) => {
  const tokenHash = RefreshToken.hash(refreshToken);

  const existingToken = await RefreshToken.findOne({
    tokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });

  // Reuse detected
  if (!existingToken) {
    throw new ApiError(401, "Invalid refresh token", "TOKEN_REUSE");
  }

  const userId = existingToken.userId;

  // Revoke old token
  existingToken.revokedAt = new Date();
  existingToken.revokedByIp = ip;

  // Create new token
  const newTokenValue = generateRefreshTokenValue();
  const newTokenHash = RefreshToken.hash(newTokenValue);

  existingToken.replacedByToken = newTokenHash;
  await existingToken.save();

  await RefreshToken.create({
    userId,
    tokenHash: newTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ip,
  });

  const accessToken = generateAccessToken({ userId });

  return {
    accessToken,
    refreshToken: newTokenValue,
  };
};

export const logoutUser = async ({ refreshToken, ip }) => {
  const tokenHash = RefreshToken.hash(refreshToken);

  const token = await RefreshToken.findOne({
    tokenHash,
    revokedAt: null,
  });

  if (token) {
    token.revokedAt = new Date();
    token.revokedByIp = ip;
    await token.save();
  }
};
