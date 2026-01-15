import express from "express";
import cors from "cors";
import helmet from "helmet";
import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import workspaceRoutes from "./modules/workspaces/workspace.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";
import taskRoutes from "./modules/tasks/task.routes.js";
import activityRoutes from "./modules/activities/activity.routes.js";

const app = express();

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON
app.use(express.json());

// Health check (important for deployment)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

app.get("/error-test", (req, res) => {
  throw new Error("Crash test");
});

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/workspaces", workspaceRoutes);

app.use("/api/v1/projects", projectRoutes);

app.use("/api/v1/tasks", taskRoutes);

app.use("/api/v1/activities", activityRoutes);

// 404 handler
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
