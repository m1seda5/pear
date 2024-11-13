// working version
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
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser); // Toggle state(follow/unfollow)
router.put("/update/:id", protectRoute, updateUser);
router.put("/freeze", protectRoute, freezeAccount);

export default router;

// verification update
// import express from "express";
// import {
//   followUnFollowUser,
//   getUserProfile,
//   loginUser,
//   logoutUser,
//   signupUser,
//   updateUser,
//   getSuggestedUsers,
//   freezeAccount,
//   awardVerification
// } from "../controllers/userController.js";
// import protectRoute from "../middlewares/protectRoute.js";
// import roleAssignment from "../middlewares/roleAssignment.js"; // Import the roleAssignment middleware

// const router = express.Router();

// // User routes

// // Signup route (roleAssignment will run first)
// router.post("/signup", roleAssignment, signupUser);

// // Other routes
// router.get("/profile/:query", getUserProfile);
// router.get("/suggested", protectRoute, getSuggestedUsers);
// router.post("/login", loginUser);
// router.post("/logout", logoutUser);
// router.post("/follow/:id", protectRoute, followUnFollowUser); // Toggle state(follow/unfollow)
// router.put("/update/:id", protectRoute, updateUser);
// router.put("/freeze", protectRoute, freezeAccount);

// // New route for awarding verification
// router.post("/awardVerification", protectRoute, awardVerification);

// export default router;
