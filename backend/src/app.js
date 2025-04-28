import express from "express";
import morgan from "morgan";
import cors from "cors";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import configRouts from "./routes/configRoutes.js";

dotenv.config();

const app = express();

console.log("DEBUG: FRONTEND_USER_URL:", process.env["FRONTEND_USER_URL"]);
console.log("DEBUG: FRONTEND_ADMIN_URL:", process.env["FRONTEND_ADMIN_URL"]);

const corsOptions = {
  origin: [process.env["FRONTEND_USER_URL"], process.env["FRONTEND_ADMIN_URL"]],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Explicitly allow methods
  allowedHeaders: "Content-Type,Authorization", // Explicitly allow requested headers
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/config", configRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const prisma = new PrismaClient();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
