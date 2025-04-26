import { protect } from "../middlewares/authMiddleware.js";
import { admin } from "../middlewares/authMiddleware.js";
import {
  createComment,
  deleteComment,
} from "../controllers/commentController.js";
import express from "express";
const router = express.Router();

router.post("/:postId", protect, createComment);

router.delete("/:id", protect, admin, deleteComment);

export default router;
