import express from "express";
import {
  upgradeBadge,
  redeemBadge,
  getUserBadges,
  getBadgeCelebration
} from "../controllers/badgeController.js";

const router = express.Router();

router.post("/upgrade", upgradeBadge);
router.post("/redeem", redeemBadge);
router.get("/user/:userId", getUserBadges);
router.get("/celebration/:userId", getBadgeCelebration);

export default router; 