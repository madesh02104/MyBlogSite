import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Get posts based on user role
export const getAllPosts = async (req, res) => {
  try {
    let isAdmin = req.user && req.user.isAdmin;

    // If not authenticated through middleware, check token directly
    if (
      !req.user &&
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user info to check admin status
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { isAdmin: true },
        });

        isAdmin = user && user.isAdmin;
      } catch (err) {
        // Token verification failed, user is not admin
        isAdmin = false;
      }
    }

    // Define query conditions
    const whereCondition = isAdmin
      ? {} // Admin sees all posts
      : { published: true };

    const posts = await prisma.post.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch posts", error: error.message });
  }
};

// Get post by ID
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id: id },
      include: {
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch post", error: error.message });
  }
};

// Create new post
export const createPost = async (req, res) => {
  try {
    const { title, content, published = false } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create post", error: error.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, published } = req.body;

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id: id },
    });

    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create update data object
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (published !== undefined) updateData.published = published;

    const updatedPost = await prisma.post.update({
      where: { id: id },
      data: updateData,
    });

    res.json(updatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update post", error: error.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await prisma.post.delete({
      where: { id: id },
    });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete post", error: error.message });
  }
};

// Publish post
export const publishPost = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: id },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: id },
      data: {
        published: true,
      },
    });

    res.json(updatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to publish post", error: error.message });
  }
};
