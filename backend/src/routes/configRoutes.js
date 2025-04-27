import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  // Only expose non-sensitive configuration
  res.json({
    adminUrl: process.env["FRONTEND-ADMIN-URL"] || "http://localhost:5173",
    userUrl: process.env["FRONTEND-USER-URL"] || "http://localhost:5174",
  });
});

export default router;
