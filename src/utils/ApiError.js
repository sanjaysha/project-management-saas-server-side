export class ApiError extends Error {
  constructor(statusCode, message, code = "API_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

// throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");
