import { ApiError } from "../utils/ApiError.js";

export const validate =
  (schema, property = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join(", ");

      throw new ApiError(400, message, "VALIDATION_ERROR");
    }

    req[property] = result.data; // sanitized input
    next();
  };
