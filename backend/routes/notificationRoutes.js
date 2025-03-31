// routes/notificationRoutes.js
import express from "express";
import { sendIdleNotifications } from "../controllers/notificationController.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();
router.post("/test-notifications", adminMiddleware, sendIdleNotifications);
export default router;