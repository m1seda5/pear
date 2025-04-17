import express from "express";
import { createGroup, getGroups, getGroupMembers, removeGroupMember, leaveGroup } from "../controllers/groupController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/create", protectRoute, createGroup);
router.get("/my-groups", protectRoute, getGroups);
router.get("/:groupId/members", protectRoute, getGroupMembers);
router.delete("/:groupId/member/:userId", protectRoute, removeGroupMember);
router.delete("/:groupId/leave", protectRoute, leaveGroup);

export default router;