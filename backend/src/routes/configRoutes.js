import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  // Only expose non-sensitive configuration
  res.json({
    userUrl: process.env["FRONTEND_USER_URL"] || "http://localhost:5174",
  });
});

export default router;
