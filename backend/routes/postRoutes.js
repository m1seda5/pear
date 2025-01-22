// athis is the orignal working version
// import express from "express";
// import {
// 	createPost,
// 	deletePost,
// 	getPost,
// 	likeUnlikePost,
// 	replyToPost,
// 	getFeedPosts,
// 	getUserPosts,
// } from "../controllers/postController.js";
// import protectRoute from "../middlewares/protectRoute.js";
// import checkTeacherAccess from "../middlewares/checkTeacherAccess.js"; // Import the teacher access middleware

// const router = express.Router();

// router.get("/feed", protectRoute, getFeedPosts);
// router.get("/:id", protectRoute, getPost); // Added protectRoute for consistency
// router.get("/user/:username", protectRoute, getUserPosts); // Added protectRoute for consistency
// router.post("/create", protectRoute, checkTeacherAccess, createPost); // Add the checkTeacherAccess middleware
// router.delete("/:id", protectRoute, deletePost);
// router.put("/like/:id", protectRoute, likeUnlikePost);
// router.put("/reply/:id", protectRoute, replyToPost);

// export default router;


// this is adding thje dmin role filtering update (working)
// import express from "express";
// import {
//   createPost,
//   deletePost,
//   getPost,
//   likeUnlikePost,
//   replyToPost,
//   getFeedPosts,
//   getUserPosts,
//   toggleNotifications,  // Add the new controller
// } from "../controllers/postController.js";
// import protectRoute from "../middlewares/protectRoute.js";
// import checkTeacherAccess from "../middlewares/checkTeacherAccess.js";
// import filterPostsByAudience from "../middlewares/filterPostsByAudience.js";

// const router = express.Router();

// // Existing routes
// router.get("/feed", protectRoute, getFeedPosts);
// router.get("/:id", protectRoute, filterPostsByAudience, getPost);
// router.get("/user/:username", protectRoute, getUserPosts);
// router.post("/create", protectRoute, checkTeacherAccess, createPost);
// router.delete("/:id", protectRoute, deletePost);
// router.put("/like/:id", protectRoute, likeUnlikePost);
// router.put("/reply/:id", protectRoute, replyToPost);

// // New notification toggle route
// router.post("/toggle-notifications", protectRoute, toggleNotifications);

// export default router;

// post review system 
// File: src/routes/postRoutes.js

import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
  toggleNotifications,
  reviewPost,
  getPendingReviews,
  deleteComment,
} from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";
import checkTeacherAccess from "../middlewares/checkTeacherAccess.js";
import filterPostsByAudience from "../middlewares/filterPostsByAudience.js";
import validateObjectId from "../middlewares/validateObjectId.js"; // Importing the new middleware

const router = express.Router();

// Review routes
router.get("/pending-reviews", protectRoute, getPendingReviews);
router.post("/review/:postId", protectRoute, reviewPost);

// Post creation and feed routes
router.post("/create", protectRoute, checkTeacherAccess, createPost);
router.get("/feed", protectRoute, getFeedPosts);
router.post("/toggle-notifications", protectRoute, toggleNotifications);

// User-specific routes
router.get("/user/:username", protectRoute, getUserPosts);

// Parameterized routes
router.get("/:id", protectRoute, filterPostsByAudience, getPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);

// Comment-specific routes with validation middleware
router.delete("/comment/:commentId", protectRoute, validateObjectId, deleteComment); // Using the validateObjectId middleware

export default router;
