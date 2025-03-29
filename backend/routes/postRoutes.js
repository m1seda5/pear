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
  deleteComment,
  getPendingReviews,
  reviewPost,
  toggleNotifications,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
  repostPost,
  notifyReviewers,
  addViewToPost
} from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";
import checkTeacherAccess from "../middlewares/checkTeacherAccess.js";
import filterPostsByAudience from "../middlewares/filterPostsByAudience.js";
import validateObjectId from "../middlewares/validateObjectId.js";
import Post from "../models/postModel.js";

const router = express.Router();

// Review system routes
router.get("/pending-reviews", protectRoute, getPendingReviews);
router.post(
  "/review/:postId",
  protectRoute,
  validateObjectId("postId"),
  reviewPost
);

// Optional: Add a route to manually trigger notifyReviewers
router.post(
  "/notify-reviewers/:postId",
  protectRoute,
  validateObjectId("postId"),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      if (req.user.role !== "admin" && req.user.role !== "teacher") {
        return res.status(403).json({ error: "Unauthorized" });
      }
      await notifyReviewers(post);
      res.status(200).json({ message: "Reviewers notified successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to notify reviewers" });
    }
  }
);

// Post creation and feed
router.post("/create", protectRoute, checkTeacherAccess, createPost);
router.get("/feed", protectRoute, getFeedPosts);
router.post("/toggle-notifications", protectRoute, toggleNotifications);
router.put("/repost/:id", protectRoute, repostPost);
router.put("/view/:id", protectRoute, validateObjectId("id"), addViewToPost);

// User-specific posts
router.get("/user/:username", protectRoute, getUserPosts);

// Single post operations
router.get(
  "/:id",
  protectRoute,
  validateObjectId("id"),
  filterPostsByAudience,
  getPost
);
router.delete("/:id", protectRoute, validateObjectId("id"), deletePost);
router.put("/like/:id", protectRoute, validateObjectId("id"), likeUnlikePost);
router.put("/reply/:id", protectRoute, validateObjectId("id"), replyToPost);

// Comment operations
router.delete(
  "/comment/:commentId",
  protectRoute,
  validateObjectId("commentId"),
  deleteComment
);

export default router;