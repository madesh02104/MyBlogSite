import axios from "./axios";

// Register a new user
export const registerUser = async (userData) => {
  const res = await axios.post("/auth/register", userData);
  return res.data;
};

// Login user
export const loginUser = async (userData) => {
  const res = await axios.post("/auth/login", userData);
  return res.data;
};
