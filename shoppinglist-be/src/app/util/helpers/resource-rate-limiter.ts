import rateLimit from "express-rate-limit";
import { resourceRateLimit } from "../variables";

// set up rate limiter: maximum of 'resourceRateLimit' requests per minute
export const resourceLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: resourceRateLimit,
});
