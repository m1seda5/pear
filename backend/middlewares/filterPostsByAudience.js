// this is the original code when the file was called filterpostbyyeargorup
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

// this is the admin role update
import Post from "../models/Post.js";
import User from "../models/User.js";

const filterPostsByAudience = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let filterCriteria = {};

    switch (user.role) {
      case "student":
        if (user.yearGroup) {
          filterCriteria.yearGroup = user.yearGroup;
        }
        break;
      case "teacher":
        if (user.department) {
          filterCriteria.department = user.department;
        }
        break;
      case "admin":
        // No filtering for admin
        filterCriteria = {};
        break;
      default:
        return res.status(400).json({ error: "Invalid role" });
    }

    const posts = await Post.find(filterCriteria);

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found for this audience" });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error filtering posts by audience:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export default filterPostsByAudience;


