
import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

import {
  downloadProfile,
  register,
  login,
  uploadProfilePicture,
  updateUserProfile,
  getUserAndProfile,
  updateProfileData,
  getAllUserProfile,
  sendConnectionRequest,
  getMyConnectionsRequests,
  whatAreMyConnections,
  acceptUserConnectionRequest,
  getProfileBasedOnUsername,
} from "../controllers/user.controller.js";

const router = Router();

const uploadDir = "uploads";

// Create the upload directory if it does not exist.
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
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// Profile picture
router.post(
  "/update_profile_picture",
  upload.single("profile_picture"),
  uploadProfilePicture
);

// Authentication
router.post("/register", register);
router.post("/login", login);

// User profile
router.post("/user_update", updateUserProfile);
router.post("/update_profile_data", updateProfileData);
router.route("/get_user_and_profile").get(getUserAndProfile).post(getUserAndProfile);
router.route("/get_all_users").get(getAllUserProfile).post(getAllUserProfile);
router.get("/user/get_profile_based_on_username",getProfileBasedOnUsername);


// Connection requests
router.post("/user/send_connection_request", sendConnectionRequest);
router.get("/user/getConnection_requests", getMyConnectionsRequests);
router.get("/user/user_connection_request", whatAreMyConnections);
router.post(
  "/user/accept_connection_request",
  acceptUserConnectionRequest
);

// Resume download
router.get("/download_resume", downloadProfile);

export default router;
