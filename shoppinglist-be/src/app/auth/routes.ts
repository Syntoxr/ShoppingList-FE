import express from "express";
import { sign } from "jsonwebtoken";
import { mwBasicAuth } from "./middleware";
import { tokenLifetime, tokenSecret } from "./variables";

const router = express.Router();
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
