import User from "../models/userModel.js";

const assignRole = async (req, res, next) => {
  try {
    if (!req.body.email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const { email } = req.body;

    // Assign role based on email
    let role;
    if (email.includes("students")) {
      role = "student";
    } else {
      role = "teacher";
    }

    // Update the user's role in the database if this is during signup
    if (req.method === "POST" && req.route.path === "/signup") {
      req.body.role = role; // Add role to the request body
    }

    // For login or other processes, verify and update role if needed
    const user = await User.findOne({ email });
    if (user && user.role !== role) {
      user.role = role;
      await user.save();
    }

    req.userRole = role; // Pass the role down the request pipeline
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default assignRole;
