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
// import User from "../models/userModel.js";

// const filterPostsByAudience = async (req, res, next) => {
//   try {
//     if (!req.user || !req.user._id) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const user = await User.findById(req.user._id);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     let filter = {};

//     if (user.role === "student") {
//       filter.targetYearGroups = { $in: [user.yearGroup, "all"] };
//     }

//     if (user.role === "teacher") {
//       filter.targetDepartments = { $in: [user.department] };
//     }

//     // Check if the user is admin or tv, and filter by targetTV
//     if (user.role === "admin") {
//       filter.targetTV = { $in: [true] };  // Admin can target TV posts
//     }

//     if (user.role === "tv") {
//       filter.targetTV = { $in: [true] };  // TV users see posts targeted to TV
//     }

//     req.filter = filter;
//     next();
//   } catch (error) {
//     return res.status(500).json({ error: "Failed to filter posts by audience" });
//   }
// };

// export default filterPostsByAudience;


// filtering update testing
import User from "../models/userModel.js";

const filterPostsByAudience = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('groups');
    const userId = req.user._id;
    const userGroupIds = user.groups.map(g => g._id);
    
    const postFilter = {
      $or: [
        { targetAudience: "all" },
        { postedBy: userId },
        { targetGroups: { $in: userGroupIds } },
        ...(user.role === "student" ? [
          { targetYearGroups: user.yearGroup }
        ] : []),
        ...(user.role === "teacher" ? [
          { targetDepartments: user.department }
        ] : [])
      ]
    };

    if (user.role === "student") {
      // Additional student specific filters are already included in postFilter
    } else if (user.role === "teacher") {
      postFilter.$or.push(
        { targetYearGroups: { $in: user.yearGroups } }
      );
    } else if (user.role === "admin") {
      postFilter.$or.push(
        { targetDepartments: { $exists: true } },
        { targetYearGroups: { $exists: true } }
      );
    }
    
    req.filter = postFilter;
    next();
  } catch (error) {
    console.error("Filter posts error:", error);
    res.status(500).json({ error: "Failed to filter posts" });
  }
};

export default filterPostsByAudience;


