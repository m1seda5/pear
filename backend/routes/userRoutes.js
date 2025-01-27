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
    adminFreezeUser,  // NEW IMPORT
    adminDeleteUser   // NEW IMPORT
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";
import adminMiddleware from "../middlewares/adminMiddleware.js"; // NEW IMPORT

const router = express.Router();

// Admin routes (NEW SECTION)
router.post("/admin/freeze-user", protectRoute, adminMiddleware, adminFreezeUser);
router.delete("/admin/delete-user", protectRoute, adminMiddleware, adminDeleteUser);

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

export default router;


