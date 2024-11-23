// // this is the original
// import User from "../models/userModel.js";

// const filterPostsByYearGroup = async (req, res, next) => {
//   try {
//     if (!req.user || !req.user._id) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const user = await User.findById(req.user._id);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     if (user.email.includes("students") && user.yearGroup) {
//       req.yearGroup = user.yearGroup;
//     } else {
//       req.yearGroup = "all";
//     }

//     next();
//   } catch (error) {
//     res.status(500).json({ error: "Error filtering posts by year group" });
//   }
// };

// export default filterPostsByYearGroup;


// admin role update
import User from "../models/userModel.js";

const filterPostsByAudience = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Default to 'all' if no specific filtering is required
    let filter = {};

    if (user.role === "student") {
      // Students can only see posts from their year group
      filter.targetAudience = user.yearGroup; // filter by year group
    } else if (user.role === "teacher" || user.role === "admin") {
      // Teachers and admins can target year groups or departments
      if (user.targetYearGroups.length > 0) {
        filter.targetAudience = { $in: user.targetYearGroups }; // Match any of the targeted year groups
      }
      if (user.targetDepartments.length > 0) {
        filter.targetAudience = { $in: user.targetDepartments }; // Match any of the targeted departments
      }
    }

    // Attach the filter to the request object for further use in the route handler
    req.filter = filter;

    next();
  } catch (error) {
    res.status(500).json({ error: "Error filtering posts by audience" });
  }
};

export default filterPostsByAudience;

