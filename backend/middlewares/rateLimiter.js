// middlewares/rateLimiter.js
import rateLimit from "express-rate-limit";

export const gameUpdateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many game updates from this IP, please try again after 15 minutes"
});