import User from "../models/userModel.js";
import GameAuditLog from "../models/gameAuditLogModel.js";
import Competition from "../models/competitionModel.js";
import nodemailer from "nodemailer";

// Upgrade badge (called when user crosses a threshold)
const upgradeBadge = async (req, res) => {
  try {
    const { userId, newBadge, points, requestId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.badges.includes(newBadge)) user.badges.push(newBadge);
    user.lastBadge = newBadge;
    user.points = points;
    await user.save();
    await GameAuditLog.create({
      user: userId,
      action: `badge-upgrade-${newBadge}`,
      points,
      requestId,
      details: { newBadge }
    });
    res.json({ message: "Badge upgraded", badges: user.badges, lastBadge: user.lastBadge });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Redeem badge (for Ruby/Emerald/Sapphire)
const redeemBadge = async (req, res) => {
  try {
    const { userId, badge } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.outOfCompetition = true;
    await user.save();
    await GameAuditLog.create({
      user: userId,
      action: `badge-redeem-${badge}`,
      details: { badge }
    });
    // Send email to admin for redemption
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: "81d810001@smtp-brevo.com",
        pass: "6IBdE9hsKrHUxD4G",
      },
    });
    await transporter.sendMail({
      from: "pearnet104@gmail.com",
      to: "emiseda@students.brookhouse.ac.ke",
      subject: `Badge Redemption: ${badge}`,
      text: `User ${user.username} (${user.email}) has redeemed their ${badge} badge. Please process the reward.`
    });
    res.json({ message: "Badge redeemed, user is out of competition." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all badges for a user
const getUserBadges = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ badges: user.badges, lastBadge: user.lastBadge });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get badge celebration info for modal
const getBadgeCelebration = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ lastBadge: user.lastBadge });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  upgradeBadge,
  redeemBadge,
  getUserBadges,
  getBadgeCelebration
}; 