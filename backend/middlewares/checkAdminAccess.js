import User from "../models/userModel.js";

const checkAdminAccess = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default checkAdminAccess;
