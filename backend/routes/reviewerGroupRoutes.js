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
import { getReviewerDecisions, getGroupReviewStats } from "../controllers/auditController.js";

const router = express.Router();

router.post("/", protectRoute, adminMiddleware, createReviewerGroup);
router.get("/", protectRoute, adminMiddleware, getReviewerGroups);
router.put("/:id", protectRoute, adminMiddleware, updateReviewerGroup);
router.delete("/:id", protectRoute, adminMiddleware, deleteReviewerGroup);
router.post("/:groupId/members", protectRoute, adminMiddleware, addMemberToGroup);
router.delete("/:groupId/members/:userId", protectRoute, adminMiddleware, removeMemberFromGroup);
router.get('/:groupId/stats', protectRoute, adminMiddleware, getGroupReviewStats);
router.get('/reviewer/:userId/decisions', protectRoute, adminMiddleware, getReviewerDecisions);

export default router;