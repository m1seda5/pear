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
    // Check for token in both jwt and token cookies for backward compatibility
    const token = req.cookies.token || req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ 
        error: "Unauthorized", 
        message: "Please log in to continue" 
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!decoded) {
        return res.status(401).json({ 
          error: "Unauthorized", 
          message: "Invalid token" 
        });
      }

      // Skip database lookup if user is already attached
      if (req.user) {
        return next();
      }

      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(404).json({ 
          error: "Not Found", 
          message: "User not found" 
        });
      }

      // Add ban/freeze checks
      if (user.isBanned) {
        return res.status(403).json({ 
          error: "Forbidden", 
          message: "Account permanently banned" 
        });
      }

      if (user.isFrozen && new Date() < user.freezeUntil) {
        return res.status(403).json({ 
          error: "Forbidden", 
          message: `Account frozen until ${user.freezeUntil.toLocaleDateString()}`
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      // Handle JWT verification errors
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: "Unauthorized", 
          message: "Session expired. Please log in again." 
        });
      }
      throw jwtError;
    }
  } catch (err) {
    console.error("Error in protectRoute middleware:", err.message);
    res.status(500).json({ 
      error: "Internal Server Error", 
      message: "An error occurred while processing your request" 
    });
  }
};

export default protectRoute;