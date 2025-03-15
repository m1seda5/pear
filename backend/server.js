// routes/reviewerGroupRoutes.js
import express from "express";
import {
  createReviewerGroup,
  getReviewerGroups,
  updateReviewerGroup,
  deleteReviewerGroup,
  addMemberToGroup,
  removeMemberFromGroup
} from "../controllers/reviewerGroupController.js";
import protectRoute from "../middlewares/protectRoute.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/", protectRoute, adminMiddleware, createReviewerGroup);
router.get("/", protectRoute, adminMiddleware, getReviewerGroups);
router.put("/:id", protectRoute, adminMiddleware, updateReviewerGroup);
router.delete("/:id", protectRoute, adminMiddleware, deleteReviewerGroup);
router.post("/:groupId/members", protectRoute, adminMiddleware, addMemberToGroup);
router.delete("/:groupId/members/:userId", protectRoute, adminMiddleware, removeMemberFromGroup);

export default router;

// Update server.js to include reviewerGroupRoutes
import path from "path";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import reviewerGroupRoutes from "./routes/reviewerGroupRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js";
import job from "./cron/cron.js";

dotenv.config();

connectDB();
job.start();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reviewer-groups", reviewerGroupRoutes);

// http://localhost:5000 => backend,frontend

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// react app
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));


// email verficiation update 
// import path from "path";
// import express from "express";
// import dotenv from "dotenv";
// import connectDB from "./db/connectDB.js";
// import cookieParser from "cookie-parser";
// import userRoutes from "./routes/userRoutes.js";
// import postRoutes from "./routes/postRoutes.js";
// import messageRoutes from "./routes/messageRoutes.js";
// import { v2 as cloudinary } from "cloudinary";
// import { app, server } from "./socket/socket.js";
// import job from "./cron/cron.js";

// dotenv.config();

// connectDB();
// job.start();

// const PORT = process.env.PORT || 5000;
// const __dirname = path.resolve();

// cloudinary.config({
// 	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// 	api_key: process.env.CLOUDINARY_API_KEY,
// 	api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Middlewares
// app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
// app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
// app.use(cookieParser());

// // Routes
// app.use("/api/users", userRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/messages", messageRoutes);

// // React frontend setup
// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static(path.join(__dirname, "/frontend/dist")));
// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// 	});
// }

// server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
