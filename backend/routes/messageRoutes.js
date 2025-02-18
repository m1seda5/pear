// // original version before roles update
// import express from "express";
// import protectRoute from "../middlewares/protectRoute.js";
// import { getMessages, sendMessage, getConversations, deleteMessage } from "../controllers/messageController.js";

// const router = express.Router();

// router.get("/conversations", protectRoute, getConversations);
// router.get("/:otherUserId", protectRoute, getMessages);
// router.post("/", protectRoute, sendMessage);

// // Added delete message route
// router.delete("/:messageId", protectRoute, deleteMessage);

// export default router;

// version 2
// messageController.js
import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import checkChatAccess from "../middlewares/checkChatAccess.js";
import {
  getMessages,
  sendMessage,
  getConversations,
  deleteMessage,
  getAllConversations,
  sendMonitoringNotification,
  createGroupChat,
  addToGroup,
  removeFromGroup,
  updateGroup,
  getGroupMessages,
  checkExistingGroup, // Add this import
} from "../controllers/messageController.js";

const router = express.Router();

// Config route
router.get("/config/group-limits", protectRoute, (req, res) => {
  res.json({ maxMembers: parseInt(process.env.MAX_GROUP_MEMBERS) || 30 });
});

// Group Chat Routes
router.get("/groups/check", protectRoute, checkExistingGroup); // Add this new route
router.post("/groups/create", protectRoute, createGroupChat);
router.get("/groups/:groupId/messages", protectRoute, checkChatAccess, getGroupMessages);
router.patch("/groups/:conversationId/add", protectRoute, addToGroup);
router.patch("/groups/:conversationId/remove", protectRoute, removeFromGroup);
router.put("/groups/:conversationId", protectRoute, updateGroup);

// Admin Routes
router.get("/admin/conversations", protectRoute, checkChatAccess, getAllConversations);
router.post("/notify-monitoring/:conversationId", protectRoute, checkChatAccess, sendMonitoringNotification);

// Regular Chat Routes
router.get("/conversations", protectRoute, checkChatAccess, getConversations);
router.get("/:otherUserId", protectRoute, checkChatAccess, getMessages);
router.post("/", protectRoute, checkChatAccess, sendMessage);
router.delete("/:messageId", protectRoute, checkChatAccess, deleteMessage);

export default router;