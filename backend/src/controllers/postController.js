import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { fallbackPosts } from "../utils/fallbackPosts.js";

const prisma = new PrismaClient();
const allowFallbackPosts =
  process.env.ENABLE_FALLBACK_POSTS === "true" ||
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "test";

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

    const rawLimit = req.query.limit;
    const cursorCreatedAt = req.query.cursorCreatedAt;
    const cursorId = req.query.cursorId;
    const limit = rawLimit ? Number(rawLimit) : null;

    if (rawLimit && (!Number.isFinite(limit) || limit <= 0)) {
      return res.status(400).json({ message: "Invalid limit" });
    }

    const isPaginated = Boolean(limit || cursorCreatedAt || cursorId);
    const hasCursor = Boolean(cursorCreatedAt || cursorId);

    if (hasCursor && (!cursorCreatedAt || !cursorId)) {
      return res
        .status(400)
        .json({ message: "Cursor must include createdAt and id" });
    }

    if (!isPaginated) {
      const posts = await prisma.post.findMany({
        where: whereCondition,
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.json(posts);
    }

    const safeLimit = limit || 8;
    const cursorDate = cursorCreatedAt ? new Date(cursorCreatedAt) : null;

    if (cursorCreatedAt && Number.isNaN(cursorDate?.getTime?.())) {
      return res.status(400).json({ message: "Invalid cursor createdAt" });
    }

    const paginationFilter = cursorDate
      ? {
          OR: [
            { createdAt: { lt: cursorDate } },
            { createdAt: cursorDate, id: { lt: cursorId } },
          ],
        }
      : {};

    const posts = await prisma.post.findMany({
      where: { ...whereCondition, ...paginationFilter },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: safeLimit + 1,
    });

    const hasMore = posts.length > safeLimit;
    const items = hasMore ? posts.slice(0, safeLimit) : posts;
    const lastPost = items[items.length - 1];
    const nextCursor = lastPost
      ? { createdAt: lastPost.createdAt, id: lastPost.id }
      : null;
    return res.json({ items, nextCursor, hasMore });
  } catch (error) {
    if (
      error.message &&
      error.message.includes("Can't reach database server")
    ) {
      if (!allowFallbackPosts) {
        return res.status(503).json({ message: "Database unavailable" });
      }

      const isAdmin = req.user && req.user.isAdmin;
      const rawLimit = req.query.limit;
      const cursorCreatedAt = req.query.cursorCreatedAt;
      const cursorId = req.query.cursorId;
      const limit = rawLimit ? Number(rawLimit) : null;
      const isPaginated = Boolean(limit || cursorCreatedAt || cursorId);
      const safeLimit = limit || 8;

      const visibleFallback = isAdmin
        ? fallbackPosts
        : fallbackPosts.filter((post) => post.published);

      if (!isPaginated) {
        return res.json(visibleFallback);
      }

      const sortedFallback = [...visibleFallback].sort((a, b) => {
        const dateDiff = new Date(b.createdAt) - new Date(a.createdAt);
        if (dateDiff !== 0) return dateDiff;
        return String(b.id).localeCompare(String(a.id));
      });

      let filteredFallback = sortedFallback;
      if (cursorCreatedAt && cursorId) {
        const cursorDate = new Date(cursorCreatedAt);
        filteredFallback = sortedFallback.filter((post) => {
          const postDate = new Date(post.createdAt);
          return (
            postDate < cursorDate ||
            (postDate.getTime() === cursorDate.getTime() &&
              String(post.id) < String(cursorId))
          );
        });
      }

      const pageItems = filteredFallback.slice(0, safeLimit + 1);
      const hasMore = pageItems.length > safeLimit;
      const items = hasMore ? pageItems.slice(0, safeLimit) : pageItems;
      const lastPost = items[items.length - 1];
      const nextCursor = lastPost
        ? { createdAt: lastPost.createdAt, id: lastPost.id }
        : null;

      return res.json({ items, nextCursor, hasMore });
    }

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
            authorName: true,
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
    if (
      error.message &&
      error.message.includes("Can't reach database server")
    ) {
      if (!allowFallbackPosts) {
        return res.status(503).json({ message: "Database unavailable" });
      }

      const fallbackPost = fallbackPosts.find(
        (post) => post.id === req.params.id,
      );
      if (!fallbackPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.json(fallbackPost);
    }

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
