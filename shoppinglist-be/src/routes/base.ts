import express from "express";

const router = express.Router();

// API base endpoint
router.get("/", (req, res) => {
  res.json({ message: "API Ok" });
});

export { router };
