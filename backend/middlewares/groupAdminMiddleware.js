import Conversation from "../models/conversationModel.js";

const verifyGroupAdmin = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (conversation.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Only group admin can perform this action" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rateLimiter = (windowMs, maxRequests) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const currentTime = Date.now();

    if (!requests.has(ip)) {
      requests.set(ip, { count: 1, startTime: currentTime });
      return next();
    }

    const entry = requests.get(ip);
    if (currentTime - entry.startTime > windowMs) {
      requests.set(ip, { count: 1, startTime: currentTime });
      return next();
    }

    if (entry.count >= maxRequests) {
      return res.status(429).json({ error: "Too many requests" });
    }

    entry.count++;
    next();
  };
};

export { verifyGroupAdmin, rateLimiter };