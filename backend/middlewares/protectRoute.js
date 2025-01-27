// import User from "../models/userModel.js";
// import jwt from "jsonwebtoken";

// const protectRoute = async (req, res, next) => {
// 	try {
// 		const token = req.cookies.jwt;

// 		if (!token) return res.status(401).json({ message: "Unauthorized" });

// 		const decoded = jwt.verify(token, process.env.JWT_SECRET);

// 		const user = await User.findById(decoded.userId).select("-password");

// 		req.user = user;

// 		next();
// 	} catch (err) {
// 		res.status(500).json({ message: err.message });
// 		console.log("Error in signupUser: ", err.message);
// 	}
// };

// export default protectRoute;


// original working version
// import jwt from "jsonwebtoken";
// import User from "../models/userModel.js"; // Ensure the User model is imported

// const protectRoute = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt;

//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized, no token provided" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (!decoded) {
//       return res.status(401).json({ message: "Unauthorized, token verification failed" });
//     }

//     // If user is already present, skip the database lookup
//     if (req.user) {
//       next();
//       return;
//     }

//     const user = await User.findById(decoded.userId).select("-password");

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error("Error in protectRoute middleware:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// };


// export default protectRoute;


import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized, token verification failed" });
    }

    // Skip database lookup if user is already attached
    if (req.user) {
      return next();
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add ban/freeze checks (NEW)
    if (user.isBanned) {
      return res.status(403).json({ error: "Account permanently banned" });
    }

    if (user.isFrozen && new Date() < user.freezeUntil) {
      return res.status(403).json({ 
        error: `Account frozen until ${user.freezeUntil.toLocaleDateString()}`
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Error in protectRoute middleware:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export default protectRoute;