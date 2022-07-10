import express from "express";
import rateLimit from "express-rate-limit";
import { sign } from "jsonwebtoken";

import { mwBasicAuth } from "./middleware";
import { loginRateLimit, tokenLifetime, tokenSecret } from "./variables";

const router = express.Router();
// set up rate limiter: maximum of 'requestRateLimit' requests per minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: loginRateLimit,
});

// apply rate limiter to all requests
router.use(limiter);

router.use(mwBasicAuth);

console.log(`Token lifetime: ${tokenLifetime} seconds`);

// endpoints will be relative to /api/auth

router.get("/login", (req, res) => {
  const tokenPayload = {
    iat: Math.floor(Date.now() / 1000),
  };
  const token = sign(tokenPayload, tokenSecret, {
    issuer: res.locals.username,
    expiresIn: tokenLifetime,
  });
  res.json({ token: token });
});

export { router };
