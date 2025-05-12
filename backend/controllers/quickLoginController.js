import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Generate a secure quick login token
const generateQuickLoginToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate a quick login link for a user
export const generateQuickLoginLink = async (userId, redirectPath = "/") => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Generate a new token
    const token = generateQuickLoginToken();
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1); // Token valid for 1 hour

    // Save token and redirect path to user
    user.quickLoginToken = token;
    user.quickLoginTokenExpiry = expiry;
    user.quickLoginRedirect = redirectPath;
    await user.save();

    // Return the quick login URL
    return `https://pear-tsk2.onrender.com/quick-login?token=${token}`;
  } catch (error) {
    console.error("Error generating quick login link:", error);
    throw error;
  }
};

// Verify and process quick login
export const processQuickLogin = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }

    // Find user with matching token
    const user = await User.findOne({
      quickLoginToken: token,
      quickLoginTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Generate JWT token
    const authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Get the redirect path before clearing the token
    const redirectPath = user.quickLoginRedirect || "/";

    // Clear quick login token and redirect path
    user.quickLoginToken = null;
    user.quickLoginTokenExpiry = null;
    user.quickLoginRedirect = null;
    await user.save();

    // Set cookie with more permissive settings
    res.cookie("token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "none", // Allow cross-site requests
      path: "/" // Ensure cookie is available for all paths
    });

    // Send user data along with redirect
    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role
      },
      redirectPath
    });
  } catch (error) {
    console.error("Error in quick login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}; 