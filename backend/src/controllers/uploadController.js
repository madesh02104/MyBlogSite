import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import path from "path";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file provided" });
  }

  const ext = path.extname(req.file.originalname).toLowerCase();
  const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  if (!allowed.includes(ext)) {
    return res
      .status(400)
      .json({ message: "Only image files are allowed (jpg, png, gif, webp)" });
  }

  const key = `posts/${randomUUID()}${ext}`;

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    res.status(201).json({ url });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to upload image", error: error.message });
  }
};
