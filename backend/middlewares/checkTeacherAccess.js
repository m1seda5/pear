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


// admin role update
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

    // If user is a student, force target audience to "all"
    if (user.role === "student") {
      req.body.targetAudience = "all";
      req.body.targetYearGroups = [];
      req.body.targetDepartments = [];
      return next();
    }

    // Check if the user is attempting to target posts
    if (req.body.targetAudience) {
      // If the user is not a teacher or admin, deny access to target posts
      if (user.role !== "teacher" && user.role !== "admin") {
        return res.status(403).json({ error: "Access denied for targeted posting" });
      }

      // If the user is a teacher, ensure they are targeting only their allowed year groups or departments
      if (user.role === "teacher") {
        const { targetYearGroups, targetDepartments } = user;
        const { yearGroup, department } = req.body.targetAudience;

        // Check if the yearGroup or department is valid for the teacher's access
        if (
          (yearGroup && !targetYearGroups.includes(yearGroup)) ||
          (department && !targetDepartments.includes(department))
        ) {
          return res.status(403).json({ error: "Access denied: Invalid target audience for this teacher" });
        }
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default checkTeacherAccess;
