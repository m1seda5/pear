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
  verifyOTP, // Import verifyOTP
  freezeUser, // Import admin freeze functionality
  deleteUser, // Import admin delete functionality
  deleteOwnAccount,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";
import checkFrozen from "../middlewares/checkFrozen.js";
import validateObjectId from "../middlewares/validateObjectId.js";

const router = express.Router();

// Public routes
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected routes
router.get("/profile/:query", protectRoute, checkFrozen, getUserProfile);
router.get("/suggested", protectRoute, checkFrozen, getSuggestedUsers);
router.post("/follow/:id", protectRoute, checkFrozen, followUnFollowUser);
router.put("/update/:id", protectRoute, checkFrozen, updateUser);
router.put("/freeze", protectRoute, checkFrozen, freezeAccount);
router.delete("/me", protectRoute, checkFrozen, deleteOwnAccount);

// Admin routes
router.put(
  "/admin/freeze/:userId",
  protectRoute,
  validateObjectId("userId"),
  freezeUser
);
router.delete(
  "/admin/delete/:userId",
  protectRoute,
  validateObjectId("userId"),
  deleteUser
);

// OTP verification
router.post("/verify-otp", verifyOTP);

export default router;


