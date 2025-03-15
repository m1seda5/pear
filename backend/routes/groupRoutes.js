import express from "express";
import { createGroup, getGroups } from "../controllers/groupController.js";
import protectRoute from "../middlewares/protectRoute.js";
import adminOrTeacherMiddleware from "../middlewares/adminOrTeacherMiddleware.js";

const router = express.Router();

router.post("/create", protectRoute, adminOrTeacherMiddleware, createGroup);
router.get("/my-groups", protectRoute, getGroups);

export default router;