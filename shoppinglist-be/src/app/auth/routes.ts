import express from "express";
import { mwBasicAuth } from "./middleware";

const router = express.Router();
router.use(mwBasicAuth);
// endpoints will be relative to /api/auth

router.get("/login", (req, res) => {
  res.send("TOKEN");
});

export { router };
