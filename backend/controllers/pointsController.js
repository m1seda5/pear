import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import GameAuditLog from "../models/gameAuditLogModel.js";
import Competition from "../models/competitionModel.js";
import mongoose from "mongoose";

// Helper: Check if competition is active and user is eligible
const checkCompetitionActive = async (userId) => {
  const comp = await Competition.findOne().sort({ createdAt: -1 });
  if (!comp || !comp.isActive) return { error: "Competition is paused" };
  const user = await User.findById(userId);
  if (!user || user.outOfCompetition) return { error: "User is out of competition" };
  return { comp, user };
};

// Trending post (admin fire reaction)
const awardTrendingPostPoints = async (req, res) => {
  try {
    const { adminId, postId, requestId } = req.body;
    const { comp, user: admin } = await checkCompetitionActive(adminId);
    if (!comp) return res.status(400).json({ error: "Competition is paused" });
    if (!admin || admin.role !== "admin") return res.status(403).json({ error: "Only admins can award trending" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Prevent duplicate fire from same admin
    if (post.trendingReactions.some(r => r.user.equals(adminId) && r.type === "fire")) {
      return res.status(400).json({ error: "Already awarded trending for this post" });
    }

    post.trendingReactions.push({ user: adminId, admin: true, type: "fire" });
    await post.save();

    // Award points to post author
    const author = await User.findById(post.postedBy);
    if (!author || author.outOfCompetition) return res.status(400).json({ error: "Author not eligible" });

    // Check idempotency
    const existing = await GameAuditLog.findOne({ requestId });
    if (existing) return res.status(200).json({ message: "Already processed" });

    let points = 50;
    if (comp.halvedPoints) points = Math.floor(points / 2);

    author.points += points;
    await author.save();

    await GameAuditLog.create({
      user: author._id,
      action: "trending-post",
      points,
      requestId,
      details: { postId }
    });

    res.json({ message: `+${points} points for trending post!`, points, pointsAwarded: points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Repost points (max 2/day, anti-abuse)
const awardRepostPoints = async (req, res) => {
  try {
    const { userId, postId, requestId } = req.body;
    const { comp, user } = await checkCompetitionActive(userId);
    if (!comp) return res.status(400).json({ error: "Competition is paused" });
    if (!user) return res.status(403).json({ error: "User not found" });

    // Check idempotency
    const existing = await GameAuditLog.findOne({ requestId });
    if (existing) return res.status(200).json({ message: "Already processed" });

    // Prevent repost/unrepost/repost abuse
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.reposts.includes(userId)) return res.status(400).json({ error: "Already reposted" });

    // Check daily repost count
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dailyReposts = await GameAuditLog.countDocuments({
      user: userId,
      action: "repost",
      timestamp: { $gte: today, $lt: tomorrow }
    });
    if (dailyReposts >= 2) return res.status(400).json({ error: "Max 2 reposts per day" });

    post.reposts.push(userId);
    await post.save();

    let points = 20;
    if (comp.halvedPoints) points = Math.floor(points / 2);

    user.points += points;
    await user.save();

    await GameAuditLog.create({
      user: userId,
      action: "repost",
      points,
      requestId,
      details: { postId }
    });

    res.json({ message: `+${points} points for repost!`, points, pointsAwarded: points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Daily post bonus (once per day)
const awardDailyPostBonus = async (req, res) => {
  try {
    const { userId, requestId } = req.body;
    const { comp, user } = await checkCompetitionActive(userId);
    if (!comp) return res.status(400).json({ error: "Competition is paused" });
    if (!user) return res.status(403).json({ error: "User not found" });

    // Check idempotency
    const existing = await GameAuditLog.findOne({ requestId });
    if (existing) return res.status(200).json({ message: "Already processed" });

    // Only once per day
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dailyBonus = await GameAuditLog.findOne({
      user: userId,
      action: "daily-post-bonus",
      timestamp: { $gte: today, $lt: tomorrow }
    });
    if (dailyBonus) return res.status(400).json({ error: "Already awarded today" });

    let points = 15;
    if (comp.halvedPoints) points = Math.floor(points / 2);

    user.points += points;
    await user.save();

    await GameAuditLog.create({
      user: userId,
      action: "daily-post-bonus",
      points,
      requestId
    });

    res.json({ message: `+${points} points for daily post!`, points, pointsAwarded: points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Daily messaging (trace two unique chats with replies)
const awardDailyMessagePoints = async (req, res) => {
  try {
    const { userId, requestId } = req.body;
    const { comp, user } = await checkCompetitionActive(userId);
    if (!comp) return res.status(400).json({ error: "Competition is paused" });
    if (!user) return res.status(403).json({ error: "User not found" });

    // Check idempotency
    const existing = await GameAuditLog.findOne({ requestId });
    if (existing) return res.status(200).json({ message: "Already processed" });

    // Find two unique conversations with replies today
    const Message = (await import("../models/messageModel.js")).default;
    const today = new Date();
    today.setHours(0,0,0,0);

    // Find all messages sent by user today
    const sentMessages = await Message.find({
      sender: userId,
      createdAt: { $gte: today }
    });

    // Find unique recipients
    const uniqueRecipients = [...new Set(sentMessages.map(m => m.conversationId.toString()))];

    // For each conversation, check if recipient replied after user's message
    let validChats = 0;
    for (const convId of uniqueRecipients) {
      const convMessages = await Message.find({
        conversationId: convId,
        createdAt: { $gte: today }
      }).sort({ createdAt: 1 });

      // Find first message sent by user
      const userMsg = convMessages.find(m => m.sender.toString() === userId);
      if (!userMsg) continue;

      // Find a reply from someone else after user's message
      const reply = convMessages.find(m => m.sender.toString() !== userId && m.createdAt > userMsg.createdAt);
      if (reply) validChats++;
      if (validChats >= 2) break;
    }

    if (validChats < 2) return res.status(400).json({ error: "Need replies from two unique users today" });

    let points = 25;
    if (comp.halvedPoints) points = Math.floor(points / 2);

    user.points += points;
    await user.save();

    await GameAuditLog.create({
      user: userId,
      action: "daily-message-bonus",
      points,
      requestId
    });

    res.json({ message: `+${points} points for daily messaging!`, points, pointsAwarded: points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login streaks (3, 5, 7, 10 days, resets after 10)
const awardLoginStreakPoints = async (req, res) => {
  try {
    const { userId, requestId } = req.body;
    const { comp, user } = await checkCompetitionActive(userId);
    if (!comp) return res.status(400).json({ error: "Competition is paused" });
    if (!user) return res.status(403).json({ error: "User not found" });

    // Check idempotency
    const existing = await GameAuditLog.findOne({ requestId });
    if (existing) return res.status(200).json({ message: "Already processed" });

    // Calculate streak
    const now = new Date();
    const lastLogin = user.lastLogin || new Date(0);
    const diffDays = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      user.streak = (user.streak || 0) + 1;
    } else if (diffDays > 1) {
      user.streak = 1;
    }
    user.lastLogin = now;

    // Award points for streaks
    let points = 0;
    if ([3, 5, 7, 10].includes(user.streak)) {
      points = { 3: 50, 5: 100, 7: 150, 10: 200 }[user.streak];
      if (comp.halvedPoints) points = Math.floor(points / 2);
      user.points += points;
    }
    // Reset streak after 10
    if (user.streak === 10) user.streak = 0;

    await user.save();

    await GameAuditLog.create({
      user: userId,
      action: "login-streak",
      points,
      requestId,
      details: { streak: user.streak }
    });

    res.json({ message: points ? `+${points} points for ${user.streak}-day streak!` : "Streak updated", points });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Award points for personal conversations (both sender and recipient)
const awardConversationPoints = async (req, res) => {
  try {
    const { senderId, recipientId, requestId } = req.body;
    const { comp } = await checkCompetitionActive(senderId);
    if (!comp) return res.status(400).json({ error: "Competition is paused" });

    // Check idempotency
    const existing = await GameAuditLog.findOne({ requestId });
    if (existing) return res.status(200).json({ message: "Already processed" });

    // Get both users
    const [sender, recipient] = await Promise.all([
      User.findById(senderId),
      User.findById(recipientId)
    ]);

    if (!sender || !recipient) {
      return res.status(404).json({ error: "Users not found" });
    }

    // Check if either user is out of competition
    if (sender.outOfCompetition || recipient.outOfCompetition) {
      return res.status(400).json({ error: "One or both users are not eligible" });
    }

    // Award points to both users
    let points = 25; // 25 points each for a complete conversation
    if (comp.halvedPoints) points = Math.floor(points / 2);

    // Update sender's points
    sender.points += points;
    await sender.save();

    // Update recipient's points
    recipient.points += points;
    await recipient.save();

    // Log both point awards
    await Promise.all([
      GameAuditLog.create({
        user: senderId,
        action: "conversation",
        points,
        requestId,
        details: { recipientId }
      }),
      GameAuditLog.create({
        user: recipientId,
        action: "conversation",
        points,
        requestId: `${requestId}_recipient`,
        details: { senderId }
      })
    ]);

    res.json({ 
      message: `+${points} points for both users!`, 
      senderPoints: sender.points,
      recipientPoints: recipient.points
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  awardTrendingPostPoints,
  awardRepostPoints,
  awardDailyPostBonus,
  awardDailyMessagePoints,
  awardLoginStreakPoints,
  awardConversationPoints
};