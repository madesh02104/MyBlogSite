import axios from "./axios";

// Fetch posts with cursor-based pagination
export const fetchPosts = async ({ limit = 8, cursor } = {}) => {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (cursor?.createdAt && cursor?.id) {
    params.set("cursorCreatedAt", cursor.createdAt);
    params.set("cursorId", cursor.id);
  }
  const query = params.toString();
  const res = await axios.get(`/posts?${query}`);
  return res.data;
};

// Fetch a single blog post
export const fetchPostById = async (id) => {
  const res = await axios.get(`/posts/${id}`);
  return res.data;
};

// Add a comment to a post
export const addComment = async (postId, commentData) => {
  const res = await axios.post(`/comments/${postId}`, commentData);
  return res.data;
};
