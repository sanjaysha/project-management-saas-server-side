import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let code = err.code || "INTERNAL_ERROR";

  // Handle invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
    code = "INVALID_ID";
  }

  // Duplicate key error (e.g., unique email)
  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate field value";
    code = "DUPLICATE_RESOURCE";
  }

  // Validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    code = "VALIDATION_ERROR";
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};
