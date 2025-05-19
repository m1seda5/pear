import express from "express";
import {
  addDailyQuestion,
  editDailyQuestion,
  getTodayQuestion,
  answerDailyQuestion,
  getAllQuestions,
  deleteDailyQuestion
} from "../controllers/dailyQuestionController.js";

const router = express.Router();

// Admin routes
router.post("/add", addDailyQuestion);
router.post("/edit/:id", editDailyQuestion);
router.delete("/delete/:id", deleteDailyQuestion);
router.get("/all", getAllQuestions);

// User routes
router.get("/today", getTodayQuestion);
router.post("/answer", answerDailyQuestion);

export default router; 