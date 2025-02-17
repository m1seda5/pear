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
import checkChatAccess from "../middlewares/checkChatAccess.js"; // Import the new middleware
import {
  getMessages,
  sendMessage,
  getConversations,
  deleteMessage,
  getAllConversations,
  sendMonitoringNotification,
  createGroupChat,
  addToGroup,
} from "../controllers/messageController.js";
import {
  verifyGroupAdmin,
  rateLimiter,
} from "../middleware/groupAdminMiddleware.js";

const router = express.Router();
// Apply middleware to group routes
router.patch(
  "/groups/:conversationId/add",
  protectRoute,
  rateLimiter(15 * 60 * 1000, 20), // 20 requests per 15 minutes
  verifyGroupAdmin,
  addToGroup
);

router.patch(
  "/groups/:conversationId/remove",
  protectRoute,
  rateLimiter(15 * 60 * 1000, 20),
  verifyGroupAdmin,
  removeFromGroup
);

router.put(
  "/groups/:conversationId",
  protectRoute,
  rateLimiter(15 * 60 * 1000, 10),
  verifyGroupAdmin,
  updateGroup
);
// Add new routes
router.get(
  "/admin/conversations",
  protectRoute,
  checkChatAccess,
  getAllConversations
);
router.post(
  "/notify-monitoring/:conversationId",
  protectRoute,
  checkChatAccess,
  sendMonitoringNotification
);

// Add these routes
router.post("/groups/create", protectRoute, createGroupChat);
router.patch("/groups/:conversationId/add", protectRoute, addToGroup);
router.patch("/groups/:conversationId/remove", protectRoute, removeFromGroup);

// Apply both protectRoute and checkChatAccess middleware
router.get("/conversations", protectRoute, checkChatAccess, getConversations);
router.get("/:otherUserId", protectRoute, checkChatAccess, getMessages);
router.post("/", protectRoute, checkChatAccess, sendMessage);

// Added delete message route
router.delete("/:messageId", protectRoute, checkChatAccess, deleteMessage);

export default router;
