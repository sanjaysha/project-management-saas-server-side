import dotenv from "dotenv";

dotenv.config();

["PORT", "MONGO_URI", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"].forEach(
  (key) => {
    if (!process.env[key]) {
      throw new Error(`Missing env: ${key}`);
    }
  },
);

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
};
