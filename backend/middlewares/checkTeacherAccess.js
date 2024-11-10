// // working previous version(original)
// import User from "../models/userModel.js";

// const checkTeacherAccess = async (req, res, next) => {
//   try {
//     if (!req.user || !req.user._id) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const userId = req.user._id;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     if (req.body.targetAudience && user.role !== "teacher") {
//       return res.status(403).json({ error: "Access denied for targeted posting" });
//     }

//     next();
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export default checkTeacherAccess;


// this is the version which has(this is part of the admin role update
// this is where we are removing that string thing for student or teacher that boolena string and replacing with any soletion of form to id 
import User from "../models/userModel.js";

const checkTeacherAccess = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "teacher") {
      return res.status(403).json({ error: "Access denied. Teachers only." });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default checkTeacherAccess;
