import rateLimit from "express-rate-limit";

export const accessRateLimiter = rateLimit({
  windowMs: Number(process.env.ACCESS_RATE_LIMIT_WINDOW_MS || 60000),
  max: Number(process.env.ACCESS_RATE_LIMIT_MAX || 30),
  standardHeaders: true,
  legacyHeaders: false,
});
