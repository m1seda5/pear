import express from "express";
import {
  awardTrendingPostPoints,
  awardRepostPoints,
  awardDailyPostBonus,
  awardDailyMessagePoints,
  awardLoginStreakPoints,
  awardConversationPoints
} from "../controllers/pointsController.js";

const router = express.Router();

router.post("/trending", awardTrendingPostPoints);
router.post("/repost", awardRepostPoints);
router.post("/daily-post", awardDailyPostBonus);
router.post("/daily-message", awardDailyMessagePoints);
router.post("/login-streak", awardLoginStreakPoints);
router.post("/conversation", awardConversationPoints);

export default router;