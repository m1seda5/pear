// // working version (this is og og)
// import express from "express";
// import {
// 	followUnFollowUser,
// 	getUserProfile,
// 	loginUser,
// 	logoutUser,
// 	signupUser,
// 	updateUser,
// 	getSuggestedUsers,
// 	freezeAccount,
// } from "../controllers/userController.js";
// import protectRoute from "../middlewares/protectRoute.js";

// const router = express.Router();

// router.get("/profile/:query", getUserProfile);
// router.get("/suggested", protectRoute, getSuggestedUsers);
// router.post("/signup", signupUser);
// router.post("/login", loginUser);
// router.post("/logout", logoutUser);
// router.post("/follow/:id", protectRoute, followUnFollowUser); // Toggle state(follow/unfollow)
// router.put("/update/:id", protectRoute, updateUser);
// router.put("/freeze", protectRoute, freezeAccount);

// export default router;



//admin role  working
// import express from "express";
// import {
// 	followUnFollowUser,
// 	getUserProfile,
// 	loginUser,
// 	logoutUser,
// 	signupUser,
// 	updateUser,
// 	getSuggestedUsers,
// 	freezeAccount,
// } from "../controllers/userController.js";
// import protectRoute from "../middlewares/protectRoute.js";

// const router = express.Router();

// router.get("/profile/:query", getUserProfile);
// router.get("/suggested", protectRoute, getSuggestedUsers);
// router.post("/signup", signupUser);
// router.post("/login", loginUser);
// router.post("/logout", logoutUser);
// router.post("/follow/:id", protectRoute, followUnFollowUser); // Toggle state(follow/unfollow)
// router.put("/update/:id", protectRoute, updateUser);
// router.put("/freeze", protectRoute, freezeAccount);

// export default router;

// email verififcation update import express from "express";
import express from "express";
import {
  followUnFollowUser,
  getUserProfile,
  loginUser,
  logoutUser,
  signupUser,
  updateUser,
  getSuggestedUsers,
  freezeAccount,
  verifyOTP,
  adminFreezeUser,
  adminDeleteUser,
  searchUsers,
  searchReviewers,
  forgotPassword,
  resetPassword,
  resendOTP,
  searchHeader
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Search routes
router.get("/search", protectRoute, searchHeader);
router.get("/search/:query", protectRoute, searchUsers);
router.get("/search-reviewers/:query", protectRoute, searchReviewers);

// Admin routes
router.post("/admin/freeze-user", protectRoute, adminMiddleware, adminFreezeUser);
router.delete("/admin/delete-user", protectRoute, adminMiddleware, adminDeleteUser);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", resetPassword);
router.post("/reset-password/:token", resetPassword);

// Existing routes
router.get("/profile/:query", getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.put("/update/:id", protectRoute, updateUser);
router.put("/freeze", protectRoute, freezeAccount);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

export default router;
