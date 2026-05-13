import { protect, admin } from "../middlewares/authMiddleware.js";
import {
  createComment,
  deleteComment,
} from "../controllers/commentController.js";
import express from "express";
const router = express.Router();

router.post("/:postId", createComment);

router.delete("/:id", protect, admin, deleteComment);

export default router;
