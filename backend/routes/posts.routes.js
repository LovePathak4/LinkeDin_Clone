
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  activeCheck,
  createPost,
  getAllPosts,
  deletePost,
  commentPost,
  get_comment_by_post,
  delete_comment_of_user,
  increment_likes,
} from "../controllers/posts.controller.js";

const router = Router();

// Ensure the uploads directory exists.
const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

router.get("/", activeCheck);

router.post("/post", upload.single("media"), createPost);
router.get("/posts", getAllPosts);
router.post("/delete_post", deletePost);
router.post("/comment", commentPost);
router.get("/get_comments", get_comment_by_post);
router.delete("/delete_comment", delete_comment_of_user);
router.post("/increment_post_like", increment_likes);

export default router;
