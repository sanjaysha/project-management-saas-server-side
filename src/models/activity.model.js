import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    entityType: {
      type: String,
      enum: ["WORKSPACE", "PROJECT", "TASK"],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    action: {
      type: String,
      enum: [
        "CREATED",
        "UPDATED",
        "DELETED",
        "STATUS_CHANGED",
        "MEMBER_INVITED",
      ],
      required: true,
    },
    metadata: {
      type: Object, // flexible, non-breaking
    },
  },
  { timestamps: true }
);

activitySchema.index({ workspaceId: 1, createdAt: -1 });

export const Activity = mongoose.model("Activity", activitySchema);
