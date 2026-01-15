import mongoose from "mongoose";
import crypto from "crypto";

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    revokedAt: {
      type: Date,
    },
    replacedByToken: {
      type: String,
    },
    createdByIp: String,
    revokedByIp: String,
  },
  { timestamps: true }
);

// Hash helper
refreshTokenSchema.statics.hash = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
