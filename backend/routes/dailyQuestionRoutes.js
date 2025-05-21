import express from "express";
import {
  addDailyQuestion,
  editDailyQuestion,
  getTodayQuestion,
  answerDailyQuestion,
  getAllQuestions,
  deleteDailyQuestion
} from "../controllers/dailyQuestionController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin routes
router.post("/add", protect, admin, addDailyQuestion);
router.post("/edit/:id", protect, admin, editDailyQuestion);
router.delete("/delete/:id", protect, admin, deleteDailyQuestion);
router.get("/all", protect, admin, getAllQuestions);

// User routes
router.get("/today", protect, getTodayQuestion);
router.post("/answer", protect, answerDailyQuestion);

export default router; 