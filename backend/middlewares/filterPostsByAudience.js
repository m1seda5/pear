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
    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch the user's details
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Initialize an empty filter
    let filter = {};

    if (user.role === "student") {
      // Students can only see posts targeted to their year group or all
      filter = { targetYearGroups: { $in: [user.yearGroup, "all"] } };
    } else if (user.role === "teacher") {
      // Teachers can see posts targeted to their department or posts targeted to all
      filter = {
        $or: [
          { targetDepartments: { $in: [user.department] } },
          { targetYearGroups: "all" },
        ],
      };
    } else if (user.role === "admin" || user.role === "tv") {
      // Admins and TV users can access posts targeting TV
      filter = { targetTV: { $in: [true] } };
    } else {
      return res.status(403).json({ error: "Access denied: invalid role" });
    }

    // Attach the filter to the request object for use in downstream operations
    req.filter = filter;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to filter posts by audience", details: error.message });
  }
};

export default filterPostsByAudience;


