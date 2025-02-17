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
  updateGroup
} from "../controllers/messageController.js";

const router = express.Router();

// Add this new route for group limits
router.get("/config/group-limits", protectRoute, (req, res) => {
  res.json({ maxMembers: parseInt(process.env.MAX_GROUP_MEMBERS) || 30 });
});

// Group Routes
router.post("/groups/create", protectRoute, createGroupChat);

// Group Management Routes
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