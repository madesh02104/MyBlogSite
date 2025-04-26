import axios from "./axios";

// Fetch all posts
export const fetchPosts = async (page = 1) => {
  const res = await axios.get(`/posts?page=${page}`);
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
