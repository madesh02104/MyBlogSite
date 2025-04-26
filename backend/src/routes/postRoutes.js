import express from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  publishPost,
} from "../controllers/postController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// Admin only
router.post("/", protect, admin, createPost);
router.put("/:id", protect, admin, updatePost);
router.delete("/:id", protect, admin, deletePost);
router.put("/:id/publish", protect, admin, publishPost);

export default router;
