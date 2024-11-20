// working previous version(original)
import User from "../models/userModel.js";

const checkTeacherAccess = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.body.targetAudience && user.role !== "teacher") {
      return res.status(403).json({ error: "Access denied for targeted posting" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default checkTeacherAccess;


