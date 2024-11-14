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
import Post from "../models/Post"; // Assuming you have a Post model
import User from "../models/User"; // Assuming you have a User model

const filterPostsByAudience = async (req, res, next) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID from the request
    const user = await User.findById(userId); // Find the user by ID

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let filterCriteria = {};

    // If the user is a student, filter posts by yearGroup
    if (user.role === "student" && user.yearGroup) {
      filterCriteria.yearGroup = user.yearGroup;
    }

    // If the user is a teacher, filter posts by department
    if (user.role === "teacher" && user.department) {
      filterCriteria.department = user.department;
    }

    // If the user is an admin, no filtering based on role is needed (optional)
    if (user.role === "admin") {
      filterCriteria = {}; // Admin sees all posts
    }

    // Retrieve posts that match the filter criteria
    const posts = await Post.find(filterCriteria);

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this audience" });
    }

    res.status(200).json(posts); // Return filtered posts
  } catch (error) {
    console.log("Error filtering posts by audience: ", error);
    res.status(500).json({ error: error.message });
  }
};

export default filterPostsByAudience;

