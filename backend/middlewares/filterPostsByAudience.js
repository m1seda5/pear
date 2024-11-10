// // this s the code where ot was called filter post by year group for the year group filtering
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


// this is for the filter post by audience update 
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

    // Set the target audience for posts based on user role
    if (user.role === "student" && user.yearGroup) {
      req.targetAudience = user.yearGroup;
    } else if (user.role === "teacher" && user.department) {
      req.targetAudience = user.department;
    } else {
      req.targetAudience = "all";
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Error filtering posts by audience" });
  }
};

export default filterPostsByAudience;
