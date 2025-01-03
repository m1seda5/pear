// this is th euodated post controller with the the new changes(dont use this)
// import Post from "../models/postModel.js";
// import User from "../models/userModel.js";
// import { v2 as cloudinary } from "cloudinary";

// const createPost = async (req, res) => {
//   try {
//     const { text, targetAudience } = req.body;
//     let { img } = req.body;
//     const userId = req.user._id;

//     if (!text) {
//       return res.status(400).json({ error: "Text field is required" });
//     }

//     // Ensure text length is within limit (500 characters max)
//     if (text.length > 500) {
//       return res.status(400).json({ error: "Text must be less than 500 characters" });
//     }

//     // Find the user who is creating the post
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Handle image upload if provided
//     if (img) {
//       const uploadedResponse = await cloudinary.uploader.upload(img);
//       img = uploadedResponse.secure_url;
//     }

//     // Check target audience permissions based on user role
//     let finalTargetAudience = null;
//     if (user.role === "admin") {
//       // Admin can set any target audience
//       finalTargetAudience = targetAudience;
//     } else if (user.role === "teacher") {
//       // Teachers can target "all" or their own department
//       finalTargetAudience = targetAudience === "all" || targetAudience === user.department ? targetAudience : "all";
//     } else if (user.role === "student") {
//       // Students cannot specify a target audience
//       finalTargetAudience = null;
//     }

//     // Create a new post
//     const newPost = new Post({
//       postedBy: userId,
//       text,
//       img,
//       targetAudience: finalTargetAudience,
//     });

//     // Save the post
//     await newPost.save();
//     res.status(201).json(newPost);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const getPost = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const post = await Post.findById(postId).populate("postedBy", "username profilePic");

//     if (!post) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     res.status(200).json(post);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const deletePost = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     if (post.postedBy.toString() !== req.user._id.toString()) {
//       return res.status(401).json({ error: "Unauthorized to delete post" });
//     }

//     if (post.img) {
//       const imgId = post.img.split("/").pop().split(".")[0];
//       await cloudinary.uploader.destroy(imgId);
//     }

//     await Post.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Post deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const likeUnlikePost = async (req, res) => {
//   try {
//     const { id: postId } = req.params;
//     const userId = req.user._id;

//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     const userLikedPost = post.likes.includes(userId);
//     if (userLikedPost) {
//       await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
//       res.status(200).json({ message: "Post unliked successfully" });
//     } else {
//       post.likes.push(userId);
//       await post.save();
//       res.status(200).json({ message: "Post liked successfully" });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const replyToPost = async (req, res) => {
//   try {
//     const { text } = req.body;
//     const postId = req.params.id;
//     const userId = req.user._id;
//     const userProfilePic = req.user.profilePic;
//     const username = req.user.username;

//     if (!text) {
//       return res.status(400).json({ error: "Text field is required" });
//     }

//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     const reply = { userId, text, userProfilePic, username };
//     post.replies.push(reply);
//     await post.save();

//     res.status(200).json(reply);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const repostPost = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const userId = req.user._id;

//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     if (post.reposts.includes(userId)) {
//       return res.status(400).json({ error: "Post already reposted" });
//     }

//     post.reposts.push(userId);
//     await post.save();
//     res.status(200).json({ message: "Post reposted successfully", post });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const getFeedPosts = async (req, res) => {
//   try {
//     const userId = req.user && req.user._id;
//     if (!userId) {
//       return res.status(401).json({ error: "Unauthorized, user not authenticated" });
//     }

//     const user = await User.findById(userId).select("role following yearGroup department isStudent");

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const following = user.following || [];
//     const allUserIds = [...following, userId];

//     let queryConditions = [
//       { targetAudience: null },
//       { targetAudience: "all" },
//       { postedBy: { $in: allUserIds } },
//     ];

//     if (user.role === "student") {
//       queryConditions.push({ targetAudience: user.yearGroup });
//     } else if (user.role === "teacher") {
//       queryConditions.push({ targetAudience: user.department });
//     }

//     const feedPosts = await Post.find({
//       $or: queryConditions,
//     }).sort({ createdAt: -1 });

//     res.status(200).json(feedPosts);
//   } catch (err) {
//     res.status(500).json({ error: "Could not fetch posts" });
//   }
// };

// const getUserPosts = async (req, res) => {
//   const { username } = req.params;
//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });
//     res.status(200).json(posts);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export {
//   createPost,
//   getPost,
//   deletePost,
//   likeUnlikePost,
//   replyToPost,
//   repostPost,
//   getFeedPosts,
//   getUserPosts,
// };

// original use this version (working this si the one to use)
// import Post from "../models/postModel.js";
// import User from "../models/userModel.js";
// import { v2 as cloudinary } from "cloudinary";

// const createPost = async (req, res) => {
//   try {
//     const { postedBy, text, targetAudience } = req.body;
//     let { img } = req.body;

//     if (!postedBy || !text) {
//       return res.status(400).json({ error: "PostedBy and text fields are required" });
//     }

//     // Find the user who is posting
//     const user = await User.findById(postedBy);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Check if the user is authorized to post
//     if (user._id.toString() !== req.user._id.toString()) {
//       return res.status(401).json({ error: "Unauthorized to create post" });
//     }

//     // Ensure text length is within limit (500 characters max)
//     if (text.length > 500) {
//       return res.status(400).json({ error: `Text must be less than 500 characters` });
//     }

//     // Handle image upload if provided
//     if (img) {
//       const uploadedResponse = await cloudinary.uploader.upload(img);
//       img = uploadedResponse.secure_url;
//     }

//     // Only teachers can set the `targetAudience`
//     let finalTargetAudience = null;
//     if (user.role === "teacher") {
//       finalTargetAudience = targetAudience || 'all';  // Default to 'all' if not specified
//     }

//     // Create the new post
//     const newPost = new Post({
//       postedBy,
//       text,
//       img,
//       targetAudience: finalTargetAudience,  // Target audience only for teachers
//     });

//     // Save the post
//     await newPost.save();

//     // Respond with the newly created post
//     res.status(201).json(newPost);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const getPost = async (req, res) => {
//   try {
//     const postId = req.params.id;

//     // Fetch the post with the postedBy details
//     const post = await Post.findById(postId).populate("postedBy", "username profilePic");

//     if (!post) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     // Return the post since the middleware has already filtered access
//     res.status(200).json(post);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const deletePost = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     if (post.postedBy.toString() !== req.user._id.toString()) {
//       return res.status(401).json({ error: "Unauthorized to delete post" });
//     }

//     if (post.img) {
//       const imgId = post.img.split("/").pop().split(".")[0];
//       await cloudinary.uploader.destroy(imgId);
//     }

//     await Post.findByIdAndDelete(req.params.id);

//     res.status(200).json({ message: "Post deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const likeUnlikePost = async (req, res) => {
//   try {
//     const { id: postId } = req.params;
//     const userId = req.user._id;

//     const post = await Post.findById(postId);

//     if (!post) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     const userLikedPost = post.likes.includes(userId);

//     if (userLikedPost) {
//       // Unlike post
//       await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
//       res.status(200).json({ message: "Post unliked successfully" });
//     } else {
//       // Like post
//       post.likes.push(userId);
//       await post.save();
//       res.status(200).json({ message: "Post liked successfully" });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const replyToPost = async (req, res) => {
//   try {
//     const { text } = req.body;
//     const postId = req.params.id;
//     const userId = req.user._id;
//     const userProfilePic = req.user.profilePic;
//     const username = req.user.username;

//     if (!text) {
//       return res.status(400).json({ error: "Text field is required" });
//     }

//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     const reply = { userId, text, userProfilePic, username };

//     post.replies.push(reply);
//     await post.save();

//     res.status(200).json(reply);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // New repostPost method
// const repostPost = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const userId = req.user._id;

//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     // Ensure the post is not already reposted by this user
//     if (post.reposts.includes(userId)) {
//       return res.status(400).json({ error: "Post already reposted" });
//     }

//     // Add user ID to reposts array
//     post.reposts.push(userId);
//     await post.save();

//     res.status(200).json({ message: "Post reposted successfully", post });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const getFeedPosts = async (req, res) => {
//   try {
//     const userId = req.user && req.user._id; // Ensure req.user exists before accessing userId

//     if (!userId) {
//       return res.status(401).json({ error: "Unauthorized, user not authenticated" });
//     }

//     const user = await User.findById(userId).select("role following yearGroup isStudent");

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Retrieve the list of users the current user is following
//     const following = user.following || [];

//     // Include the current user’s own ID in the list to fetch their posts as well
//     const allUserIds = [...following, userId];

//     // Fetch posts based on target audience and user roles
//     const feedPosts = await Post.find({
//       $or: [
//         { targetAudience: null }, // Posts without specific targeting (public)
//         { targetAudience: "all" }, // Posts targeted to all users
//         { targetAudience: user.isStudent ? user.yearGroup : user.role }, // Posts targeted to user's year group or role
//         { postedBy: { $in: allUserIds } }, // Posts by users the current user is following
//       ],
//     }).sort({ createdAt: -1 });

//     // If no posts found, return an empty array instead of 404
//     if (!feedPosts.length) {
//       return res.status(200).json([]);
//     }

//     res.status(200).json(feedPosts);
//   } catch (err) {
//     console.error("Error fetching feed posts:", err.message);
//     res.status(500).json({ error: "Could not fetch posts" });
//   }
// };

// const getUserPosts = async (req, res) => {
//   const { username } = req.params;
//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const posts = await Post.find({ postedBy: user._id }).sort({
//       createdAt: -1,
//     });

//     res.status(200).json(posts);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export {
//   createPost,
//   getPost,
//   deletePost,
//   likeUnlikePost,
//   replyToPost,
//   getFeedPosts,
//   getUserPosts,
// };

// this is the new version Admin role update
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
  try {
    const {
      postedBy,
      text,
      targetYearGroups,
      targetDepartments,
      targetAudience,
    } = req.body;
    let { img } = req.body;

    // Validate required fields
    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: "PostedBy and text fields are required" });
    }

    // Find the user who is posting
    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Authorization check
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to create post" });
    }

    // Role-specific post creation rules
    switch (user.role) {
      case "student":
        // Students can only post to 'all'
        req.body.targetAudience = "all";
        req.body.targetYearGroups = [];
        req.body.targetDepartments = [];
        break;

      case "teacher":
        // Teachers must specify year groups
        if (!targetYearGroups || targetYearGroups.length === 0) {
          return res.status(400).json({
            error: "Teachers must specify at least one year group to target",
          });
        }
        // Ensure the teacher is targeting only year groups
        req.body.targetDepartments = [];
        req.body.targetAudience = targetYearGroups[0]; // Set first targeted year group as audience
        break;

      case "admin":
        // Admins must specify a target
        if (!targetAudience && !targetYearGroups && !targetDepartments) {
          return res.status(400).json({
            error:
              "Admin must specify a target audience, year groups, or departments",
          });
        }
        break;

      default:
        return res.status(403).json({ error: "Unauthorized to create posts" });
    }

    // Handle image upload if provided
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    // Create the post
    const newPost = new Post({
      postedBy,
      text,
      img,
      targetYearGroups: targetYearGroups || [],
      targetDepartments: targetDepartments || [],
      targetAudience: req.body.targetAudience || "all",
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error in createPost:", err.message);
    res.status(500).json({ error: "Failed to create post" });
  }
};

// const getPost = async (req, res) => {
//   try {
//     const postId = req.params.id;

//     // Fetch the post with the postedBy details
//     const post = await Post.findById(postId).populate(
//       "postedBy",
//       "username profilePic"
//     );

//     if (!post) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     // Return the post since the middleware has already filtered access
//     res.status(200).json(post);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// get post fucntion changed for the filtering update

const getPost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Fetch the post matching the filter and ID
    const post = await Post.findOne({ _id: postId, ...req.filter }).populate(
      "postedBy",
      "username profilePic"
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found or access denied" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to delete post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // Like post
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const reply = { userId, text, userProfilePic, username };

    post.replies.push(reply);
    await post.save();

    res.status(200).json(reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// New repostPost method
const repostPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Ensure the post is not already reposted by this user
    if (post.reposts.includes(userId)) {
      return res.status(400).json({ error: "Post already reposted" });
    }

    // Add user ID to reposts array
    post.reposts.push(userId);
    await post.save();

    res.status(200).json({ message: "Post reposted successfully", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user && req.user._id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized, user not authenticated" });
    }

    const user = await User.findById(userId).select(
      "role following yearGroup department isStudent"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Retrieve the list of users the current user is following
    const following = user.following || [];

    // Construct a precise filtering condition
    const postFilter = {
      $or: [
        // Always allow posts targeted to 'all'
        { targetAudience: "all" },

        // For students, show posts targeting their EXACT year group
        ...(user.role === "student"
          ? [
              { targetYearGroups: { $in: [user.yearGroup] } },
              { targetAudience: user.yearGroup },
            ]
          : []),

        // For teachers, show posts targeting their EXACT department
        ...(user.role === "teacher"
          ? [
              { targetDepartments: { $in: [user.department] } },
              { targetAudience: user.department },
            ]
          : []),

        // For admin/TV, show additional posts
        ...(user.role === "admin" || user.role === "tv"
          ? [{ targetAudience: "tv" }]
          : []),

        // Always show posts from users the current user is following
        { postedBy: { $in: following } },

        // Ensure users see their own posts
        { postedBy: userId }
      ],
    };

    // Fetch posts matching the filter
    const feedPosts = await Post.find(postFilter)
      .populate("postedBy", "username profilePic")
      .sort({ createdAt: -1 })
      .limit(50); // Limit to prevent overwhelming results

    res.status(200).json(feedPosts);
  } catch (err) {
    console.error("Error fetching feed posts:", err.message);
    res.status(500).json({ error: "Could not fetch posts" });
  }
};

const getUserPosts = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
};
