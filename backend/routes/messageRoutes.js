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
  checkExistingGroup,
  getUnreadCount,
} from "../controllers/messageController.js";

const router = express.Router();

// Config route
router.get("/config/group-limits", protectRoute, (req, res) => {
  res.json({ maxMembers: parseInt(process.env.MAX_GROUP_MEMBERS) || 30 });
});
//unread count
// Add to existing routes
router.get("/unread-count", protectRoute, getUnreadCount);
// Group Chat Routes
router.get("/groups/check", protectRoute, checkExistingGroup);
router.post("/groups/create", protectRoute, createGroupChat);
router.get('/groups/:groupId', getGroupMessages);
// In your routes file (e.g., messageRoutes.js)
router.get("/groups/:conversationId/messages", protectRoute, checkChatAccess, getGroupMessages);// Updated to match frontend
router.patch("/groups/:conversationId/add", protectRoute, addToGroup);
router.patch("/groups/:conversationId/remove", protectRoute, removeFromGroup);
router.put("/groups/:conversationId", protectRoute, updateGroup);

// Admin Routes
router.get("/admin/conversations", protectRoute, checkChatAccess, getAllConversations);
router.post("/notify-monitoring/:conversationId", protectRoute, checkChatAccess, sendMonitoringNotification);

// Regular Chat Routes
router.get("/conversations", protectRoute, checkChatAccess, getConversations);
router.get("/:otherUserId", protectRoute, checkChatAccess, getMessages); // This already matches frontend
router.post("/", protectRoute, checkChatAccess, sendMessage);
router.delete("/:messageId", protectRoute, checkChatAccess, deleteMessage);

export default router;