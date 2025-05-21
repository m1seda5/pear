import Competition from "../models/competitionModel.js";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import GameAuditLog from "../models/gameAuditLogModel.js";
const nodemailer = require('nodemailer');

// Get current competition state
const getCompetitionState = async (req, res) => {
  try {
    const state = await Competition.findOne().sort({ createdAt: -1 });
    res.json(state);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle developer mode
const toggleDevMode = async (req, res) => {
  try {
    const { devMode } = req.body;
    const comp = await Competition.findOne().sort({ createdAt: -1 });
    if (!comp) return res.status(404).json({ error: "Competition not found" });
    comp.devMode = devMode;
    if (devMode) {
      comp.isActive = false;
      comp.halvedPoints = false;
    }
    await comp.save();
    res.json(comp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle halve points
const toggleHalvePoints = async (req, res) => {
  try {
    const { halvedPoints } = req.body;
    const comp = await Competition.findOne().sort({ createdAt: -1 });
    if (!comp) return res.status(404).json({ error: "Competition not found" });
    comp.halvedPoints = halvedPoints;
    await comp.save();
    res.json(comp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// End competition (admin or champion)
const endCompetition = async (req, res) => {
  try {
    const { endedBy, champion } = req.body;
    const comp = await Competition.findOne().sort({ createdAt: -1 });
    if (!comp) return res.status(404).json({ error: "Competition not found" });
    comp.isActive = false;
    comp.endedAt = new Date();
    comp.endedBy = endedBy;
    if (champion) comp.champion = champion;
    await comp.save();
    // Set all users outOfCompetition except champion
    await User.updateMany(
      { _id: { $ne: champion } },
      { $set: { outOfCompetition: true } }
    );

    // If no champion, email top 3 users
    if (!champion) {
      const topUsers = await User.find({ outOfCompetition: false })
        .sort({ points: -1 })
        .limit(3);
      if (topUsers.length > 0) {
        const transporter = nodemailer.createTransport({
          host: "smtp-relay.brevo.com",
          port: 587,
          auth: {
            user: "81d810001@smtp-brevo.com",
            pass: "6IBdE9hsKrHUxD4G"
          }
        });
        for (const user of topUsers) {
          if (user.email) {
            await transporter.sendMail({
              from: "pearnet104@gmail.com",
              to: user.email,
              subject: "Congratulations! Top 3 in Pear Competition",
              text: `Dear ${user.username},\n\nYou finished in the top 3 of the Pear Competition! Our team will contact you with your incentive.\n\nCongrats!\n\nThe Pear Team`
            });
          }
        }
        // Also email the Pear team
        await transporter.sendMail({
          from: "pearnet104@gmail.com",
          to: "pearteam@example.com",
          subject: "Pear Competition Ended - Top 3",
          text: `Competition ended with no Champion. Top 3: ${topUsers.map(u => u.username + ' (' + u.points + ' pts)').join(', ')}`
        });
      }
    }

    res.json({ message: "Competition ended", comp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reset competition (admin only)
const resetCompetition = async (req, res) => {
  try {
    await User.updateMany({}, {
      $set: {
        points: 0,
        badges: [],
        lastBadge: "wood",
        outOfCompetition: false,
        devMode: true
      }
    });
    await Post.updateMany({}, { $set: { trendingReactions: [] } });
    const comp = new Competition({
      isActive: false,
      devMode: true,
      halvedPoints: false,
      champion: null,
      endedAt: null,
      endedBy: null,
      lastReset: new Date()
    });
    await comp.save();
    res.json({ message: "Competition reset", comp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle competition mode (pause/resume)
const toggleCompetitionMode = async (req, res) => {
  try {
    const { isActive } = req.body;
    const comp = await Competition.findOne().sort({ createdAt: -1 });
    if (!comp) return res.status(404).json({ error: "Competition not found" });
    comp.isActive = isActive;
    await comp.save();
    res.json(comp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getCompetitionState,
  toggleDevMode,
  toggleHalvePoints,
  endCompetition,
  resetCompetition,
  toggleCompetitionMode
}; 