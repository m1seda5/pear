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

//     // Include the current user's own ID in the list to fetch their posts as well
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
// import Post from "../models/postModel.js";
// import User from "../models/userModel.js";
// import { v2 as cloudinary } from "cloudinary";

// const createPost = async (req, res) => {
//   try {
//     const {
//       postedBy,
//       text,
//       targetYearGroups,
//       targetDepartments,
//       targetAudience,
//     } = req.body;
//     let { img } = req.body;

//     // Validate required fields
//     if (!postedBy || !text) {
//       return res
//         .status(400)
//         .json({ error: "PostedBy and text fields are required" });
//     }

//     // Find the user who is posting
//     const user = await User.findById(postedBy);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Authorization check
//     if (user._id.toString() !== req.user._id.toString()) {
//       return res.status(401).json({ error: "Unauthorized to create post" });
//     }

//     // Role-specific post creation rules
//     switch (user.role) {
//       case "student":
//         // Students can only post to 'all'
//         req.body.targetAudience = "all";
//         req.body.targetYearGroups = [];
//         req.body.targetDepartments = [];
//         break;

//       case "teacher":
//         // Teachers must specify year groups
//         if (!targetYearGroups || targetYearGroups.length === 0) {
//           return res.status(400).json({
//             error: "Teachers must specify at least one year group to target",
//           });
//         }
//         // Ensure the teacher is targeting only year groups
//         req.body.targetDepartments = [];
//         req.body.targetAudience = targetYearGroups[0]; // Set first targeted year group as audience
//         break;

//       case "admin":
//         // Admins must specify a target
//         if (!targetAudience && !targetYearGroups && !targetDepartments) {
//           return res.status(400).json({
//             error:
//               "Admin must specify a target audience, year groups, or departments",
//           });
//         }
//         break;

//       default:
//         return res.status(403).json({ error: "Unauthorized to create posts" });
//     }

//     // Handle image upload if provided
//     if (img) {
//       const uploadedResponse = await cloudinary.uploader.upload(img);
//       img = uploadedResponse.secure_url;
//     }

//     // Create the post
//     const newPost = new Post({
//       postedBy,
//       text,
//       img,
//       targetYearGroups: targetYearGroups || [],
//       targetDepartments: targetDepartments || [],
//       targetAudience: req.body.targetAudience || "all",
//     });

//     await newPost.save();
//     res.status(201).json(newPost);
//   } catch (err) {
//     console.error("Error in createPost:", err.message);
//     res.status(500).json({ error: "Failed to create post" });
//   }
// };


// const getPost = async (req, res) => {
//   try {
//     const postId = req.params.id;

//     // Fetch the post matching the filter and ID
//     const post = await Post.findOne({ _id: postId, ...req.filter }).populate(
//       "postedBy",
//       "username profilePic"
//     );

//     if (!post) {
//       return res.status(404).json({ error: "Post not found or access denied" });
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
//     const userId = req.user && req.user._id;

//     if (!userId) {
//       return res
//         .status(401)
//         .json({ error: "Unauthorized, user not authenticated" });
//     }

//     const user = await User.findById(userId).select(
//       "role following yearGroup department isStudent"
//     );

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Retrieve the list of users the current user is following
//     const following = user.following || [];

//     // Construct a precise filtering condition
//     const postFilter = {
//       $or: [
//         // Always allow posts targeted to 'all'
//         { targetAudience: "all" },

//         // For students, show posts targeting their EXACT year group
//         ...(user.role === "student"
//           ? [
//               { targetYearGroups: { $in: [user.yearGroup] } },
//               { targetAudience: user.yearGroup },
//             ]
//           : []),

//         // For teachers, show posts targeting their EXACT department
//         ...(user.role === "teacher"
//           ? [
//               { targetDepartments: { $in: [user.department] } },
//               { targetAudience: user.department },
//             ]
//           : []),

//         // For admin/TV, show additional posts
//         ...(user.role === "admin" || user.role === "tv"
//           ? [{ targetAudience: "tv" }]
//           : []),

//         // Always show posts from users the current user is following
//         { postedBy: { $in: following } },

//         // Ensure users see their own posts
//         { postedBy: userId }
//       ],
//     };

//     // Fetch posts matching the filter
//     const feedPosts = await Post.find(postFilter)
//       .populate("postedBy", "username profilePic")
//       .sort({ createdAt: -1 })
//       .limit(50); // Limit to prevent overwhelming results

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

// post notis(working)
// import Post from "../models/postModel.js";
// import User from "../models/userModel.js";
// import { v2 as cloudinary } from "cloudinary";
// import nodemailer from 'nodemailer';

// // Email configuration
// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   auth: {
//     user: "81d810001@smtp-brevo.com",
//     pass: "6IBdE9hsKrHUxD4G",
//   },
// });

// // Helper function to send notification email
// const sendNotificationEmail = async (recipientEmail, posterId, postId, posterUsername) => {
//   const mailOptions = {
//     from: "pearnet104@gmail.com",
//     to: recipientEmail,
//     subject: "New Post on Pear! 🍐",
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//         <h2 style="color: #4CAF50;">New Post on Pear! 🍐</h2>
//         <p style="font-size: 16px;">Hello! ${posterUsername} just made a new post on Pear.</p>
//         <p style="font-size: 16px;">Don't miss out on the conversation!</p>
//         <a href="https://pear-tsk2.onrender.com/posts/${postId}" 
//            style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; 
//                   color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
//           View Post
//         </a>
//         <p style="color: #666; font-size: 12px; margin-top: 20px;">
//           You received this email because you have notifications enabled. 
//           You can disable these in your Pear account settings.
//         </p>
//       </div>
//     `
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`Notification email sent to ${recipientEmail}`);
//   } catch (error) {
//     console.error(`Error sending notification email to ${recipientEmail}:`, error);
//   }
// };

// const createPost = async (req, res) => {
//   try {
//     const {
//       postedBy,
//       text,
//       targetYearGroups,
//       targetDepartments,
//       targetAudience,
//     } = req.body;
//     let { img } = req.body;

//     // Validate required fields
//     if (!postedBy || !text) {
//       return res
//         .status(400)
//         .json({ error: "PostedBy and text fields are required" });
//     }

//     // Find the user who is posting
//     const user = await User.findById(postedBy);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Authorization check
//     if (user._id.toString() !== req.user._id.toString()) {
//       return res.status(401).json({ error: "Unauthorized to create post" });
//     }

//     // Role-specific post creation rules
//     switch (user.role) {
//       case "student":
//         // Students can only post to 'all'
//         req.body.targetAudience = "all";
//         req.body.targetYearGroups = [];
//         req.body.targetDepartments = [];
//         break;

//       case "teacher":
//         // Teachers must specify year groups
//         if (!targetYearGroups || targetYearGroups.length === 0) {
//           return res.status(400).json({
//             error: "Teachers must specify at least one year group to target",
//           });
//         }
//         // Ensure the teacher is targeting only year groups
//         req.body.targetDepartments = [];
//         req.body.targetAudience = targetYearGroups[0]; // Set first targeted year group as audience
//         break;

//       case "admin":
//         // Admins must specify a target
//         if (!targetAudience && !targetYearGroups && !targetDepartments) {
//           return res.status(400).json({
//             error:
//               "Admin must specify a target audience, year groups, or departments",
//           });
//         }
//         break;

//       default:
//         return res.status(403).json({ error: "Unauthorized to create posts" });
//     }

//     // Handle image upload if provided
//     if (img) {
//       const uploadedResponse = await cloudinary.uploader.upload(img);
//       img = uploadedResponse.secure_url;
//     }

//     // Create the post
//     const newPost = new Post({
//       postedBy,
//       text,
//       img,
//       targetYearGroups: targetYearGroups || [],
//       targetDepartments: targetDepartments || [],
//       targetAudience: req.body.targetAudience || "all",
//     });

//     await newPost.save();

//     // After successfully creating the post, send notifications
//     try {
//       // Find all users who have notifications enabled
//       const usersToNotify = await User.find({
//         notificationPreferences: true,
//         _id: { $ne: postedBy } // Exclude the post creator
//       });

//       // Send notifications in parallel
//       const notificationPromises = usersToNotify.map(recipient => 
//         sendNotificationEmail(
//           recipient.email,
//           postedBy,
//           newPost._id,
//           user.username
//         )
//       );

//       // Use Promise.allSettled to handle all notification attempts
//       await Promise.allSettled(notificationPromises);
      
//     } catch (notificationError) {
//       // Log notification errors but don't fail the post creation
//       console.error("Error sending notifications:", notificationError);
//     }

//     res.status(201).json(newPost);
//   } catch (err) {
//     console.error("Error in createPost:", err.message);
//     res.status(500).json({ error: "Failed to create post" });
//   }
// };

// const toggleNotifications = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Toggle the notification preferences
//     user.notificationPreferences = !user.notificationPreferences;
//     await user.save();

//     res.status(200).json({
//       message: `Notifications ${user.notificationPreferences ? 'enabled' : 'disabled'}`,
//       notificationPreferences: user.notificationPreferences
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const getPost = async (req, res) => {
//   try {
//     const postId = req.params.id;

//     // Fetch the post matching the filter and ID
//     const post = await Post.findOne({ _id: postId, ...req.filter }).populate(
//       "postedBy",
//       "username profilePic"
//     );

//     if (!post) {
//       return res.status(404).json({ error: "Post not found or access denied" });
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
// original
// const getFeedPosts = async (req, res) => {
//   try {
//     const userId = req.user && req.user._id;

//     if (!userId) {
//       return res
//         .status(401)
//         .json({ error: "Unauthorized, user not authenticated" });
//     }

//     const user = await User.findById(userId).select(
//       "role following yearGroup department isStudent"
//     );

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Retrieve the list of users the current user is following
//     const following = user.following || [];

//     // Construct a precise filtering condition
//     const postFilter = {
//       $or: [
//         // Always allow posts targeted to 'all'
//         { targetAudience: "all" },

//         // For students, show posts targeting their EXACT year group
//         ...(user.role === "student"
//           ? [
//               { targetYearGroups: { $in: [user.yearGroup] } },
//               { targetAudience: user.yearGroup },
//             ]
//           : []),

//         // For teachers, show posts targeting their EXACT department
//         ...(user.role === "teacher"
//           ? [
//               { targetDepartments: { $in: [user.department] } },
//               { targetAudience: user.department },
//             ]
//           : []),

//         // For admin/TV, show additional posts
//         ...(user.role === "admin" || user.role === "tv"
//           ? [{ targetAudience: "tv" }]
//           : []),

//         // Always show posts from users the current user is following
//         { postedBy: { $in: following } },

//         // Ensure users see their own posts
//         { postedBy: userId }
//       ],
//     };

//     // Fetch posts matching the filter
//     const feedPosts = await Post.find(postFilter)
//       .populate("postedBy", "username profilePic")
//       .sort({ createdAt: -1 })
//       .limit(50); // Limit to prevent overwhelming results

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
//   toggleNotifications,
//   getPost,
//   deletePost,
//   likeUnlikePost,
//   replyToPost,
//   getFeedPosts,
//   getUserPosts,
// };

// post review
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import nodemailer from 'nodemailer';
import mongoose from "mongoose";
import Group from "../models/groupModel.js";

// Email configuration
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "81d810001@smtp-brevo.com",
    pass: "6IBdE9hsKrHUxD4G",
  },
});

// Helper function to send notification email
const sendNotificationEmail = async (recipientEmail, posterId, postId, posterUsername) => {
  try {
    // First get the post to ensure it exists and get the poster's info
    const post = await Post.findById(postId)
      .populate("postedBy", "username profilePic email")
      .lean();

    if (!post) {
      console.error("Post not found for notification:", postId);
      return;
    }

    // Get the poster's info, with fallback to provided username
    const poster = post.postedBy || { username: posterUsername || "Unknown User" };
    
    const mailOptions = {
      from: "pearnet104@gmail.com",
      to: recipientEmail,
      subject: "New Post on Pear! 🍐",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4CAF50;">New Post on Pear! 🍐</h2>
          <p style="font-size: 16px;">Hello! ${poster.username} just made a new post on Pear.</p>
          <p style="font-size: 16px;">Don't miss out on the conversation!</p>
          <a href="https://pear-tsk2.onrender.com/posts/${postId}" 
             style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; 
                    color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            View Post
          </a>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            You received this email because you have notifications enabled. 
            You can disable these in your Pear account settings.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Notification email sent to ${recipientEmail}`);
  } catch (error) {
    console.error(`Error sending notification email to ${recipientEmail}:`, error);
  }
};

// Reviewer notification function
const notifyReviewers = async (post) => {
  try {
    const populatedPost = await Post.findById(post._id)
      .populate("postedBy", "username email")
      .populate("reviewers.userId", "email username role");
    if (!populatedPost) {
      console.error("Post not found for notification:", post._id);
      return;
    }
    const posterUsername = populatedPost.postedBy.username;
    const reviewers = populatedPost.reviewers;
    const getReviewerEmailTemplate = (reviewerUsername, postId, posterUsername) => {
      const reviewUrl = `https://pear-tsk2.onrender.com/posts/${postId}`;
      return `
        <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;\">
          <h2 style=\"color: #4CAF50;\">New Post Pending Review on Pear! 🍐</h2>
          <p style=\"font-size: 16px;\">Hello ${reviewerUsername},</p>
          <p style=\"font-size: 16px;\">${posterUsername} has submitted a new post that requires your review.</p>
          <p style=\"font-size: 16px;\">Please review the content and approve or reject it.</p>
          <div style=\"text-align: center; margin: 24px 0;\">
            <a href=\"${reviewUrl}\" 
               style=\"display: inline-block; padding: 12px 24px; background-color: #4CAF50; 
                      color: white; text-decoration: none; border-radius: 5px; font-size: 16px;\">
              Review Post
            </a>
          </div>
          <p style=\"color: #666; font-size: 12px; margin-top: 20px;\">
            You received this email because you have review permissions on Pear.
          </p>
        </div>
      `;
    };
    const notificationPromises = reviewers
      .filter(reviewer => reviewer.userId && reviewer.userId.email)
      .map(reviewer => {
        const mailOptions = {
          from: "pearnet104@gmail.com",
          to: reviewer.userId.email,
          subject: "New Post Pending Review on Pear! 🍐",
          html: getReviewerEmailTemplate(reviewer.userId.username, post._id, posterUsername)
        };
        return transporter.sendMail(mailOptions)
          .then(() => console.log(`Review notification sent to ${reviewer.userId.email}`))
          .catch(error => console.error(`Error sending to ${reviewer.userId.email}:`, error));
      });
    await Promise.allSettled(notificationPromises);
  } catch (error) {
    console.error("Error in notifyReviewers:", error);
  }
};

const createPost = async (req, res) => {
  try {
    const {
      postedBy,
      text,
      targetYearGroups,
      targetDepartments,
      targetAudience,
      targetGroups,
      isGeneral
    } = req.body;

    let { img } = req.body;

    // Basic validation
    if (!postedBy || !text) {
      return res.status(400).json({ error: "PostedBy and text fields are required" });
    }

    // User validation
    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to create post" });
    }

    // Get user's groups
    const userWithGroups = await User.findById(user._id).populate("groups");
    const hasGroups = userWithGroups.groups && userWithGroups.groups.length > 0;

    // Handle group selection logic
    let postIsGeneral = isGeneral || false;
    let postTargetGroups = targetGroups || [];

    if (user.role === "student") {
      // Students can only post to groups they belong to or 'all'
      if (targetGroups && targetGroups.length > 0) {
        const validGroups = await Group.find({
          _id: { $in: targetGroups },
          members: user._id 
        });
        
        if (validGroups.length !== targetGroups.length) {
          return res.status(403).json({ error: "Invalid group selection" });
        }
      }
      
      // If no groups, force general post
      if (!hasGroups || postTargetGroups.length === 0) {
        postIsGeneral = true;
        postTargetGroups = [];
      }
    } else if (!isGeneral && (!targetGroups || targetGroups.length === 0)) {
      return res.status(400).json({ error: "Must select at least one group" });
    }

    // Role-based validation and defaults
    switch (user.role) {
      case "student":
        req.body.targetAudience = "all";
        req.body.targetYearGroups = [];
        req.body.targetDepartments = [];
        break;
      case "teacher":
        if (!targetYearGroups || targetYearGroups.length === 0) {
          return res.status(400).json({ error: "Teachers must specify at least one year group to target" });
        }
        req.body.targetDepartments = [];
        req.body.targetAudience = targetYearGroups[0];
        break;
      case "admin":
        if (!targetAudience && !targetYearGroups && !targetDepartments) {
          return res.status(400).json({ error: "Admin must specify a target audience, year groups, or departments" });
        }
        break;
      default:
        return res.status(403).json({ error: "Unauthorized to create posts" });
    }

    // Handle image upload if present
    if (img) {
      try {
        // Check image size (base64 string length)
        const base64Data = img.split(',')[1];
        const sizeInBytes = Math.ceil((base64Data.length * 3) / 4);
        const sizeInMB = sizeInBytes / (1024 * 1024);
        
        if (sizeInMB > 5) {
          return res.status(400).json({ 
            error: "Image size too large. Maximum size is 5MB.",
            details: `Current size: ${sizeInMB.toFixed(2)}MB`
          });
        }

        console.log("Attempting Cloudinary upload...");
        const uploadedResponse = await cloudinary.uploader.upload(img, {
          resource_type: "auto",
          folder: "pear_posts",
          max_file_size: 5 * 1024 * 1024 // 5MB limit
        });
        
        img = uploadedResponse.secure_url;
        console.log("Upload successful:", img);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        
        // Check for specific error types
        if (uploadError.message && (uploadError.message.includes('quota') || uploadError.message.includes('limit'))) {
          return res.status(500).json({ 
            error: "Cloudinary subscription limit reached. Please upgrade your plan.",
            details: uploadError.message
          });
        }
        
        if (uploadError.message && uploadError.message.includes('File size too large')) {
          return res.status(400).json({ 
            error: "Image size too large. Maximum size is 5MB.",
            details: uploadError.message
          });
        }

        // Return detailed error message for other cases
        return res.status(500).json({ 
          error: uploadError.message || "Failed to upload image",
          details: uploadError
        });
      }
    }

    // Set up reviewers
    const adminUsers = await User.find({ role: "admin" });
    let reviewers = user.role === "student" ? adminUsers.map(admin => ({ userId: admin._id, role: "admin", decision: "pending" })) : [];

    if (user.role === "student") {
      try {
        const reviewerGroups = await Group.find({ "permissions.postReview": true }).populate("members");
        const groupReviewers = reviewerGroups.flatMap(group =>
          group.members.map(member => ({ userId: member._id, role: member.role, decision: "pending" }))
        );
        reviewers = [...reviewers, ...groupReviewers];
      } catch (err) {
        console.error("Error finding reviewer groups:", err);
      }
    }

    // Create and save the post
    const newPost = new Post({
      postedBy,
      text,
      img: img || "",
      targetYearGroups: targetYearGroups || [],
      targetDepartments: targetDepartments || [],
      reviewStatus: user.role === "student" ? "pending" : "approved",
      targetAudience: req.body.targetAudience || "all",
      reviewers,
      targetGroups: postTargetGroups,
      isGeneral: postIsGeneral
    });

    await newPost.save();

    // Notify reviewers if needed
    if (user.role === "student") {
      await notifyReviewers(newPost);
    }

    // Handle TV/Screen notifications
    if (Array.isArray(targetDepartments) && targetDepartments.includes("tv")) {
      try {
        let html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 12px; border: 1px solid #e2e8f0;">
            <h2 style="color: #2B6CB0; margin-bottom: 12px;">Screen Display Request</h2>
            <p style="font-size: 16px; color: #222; margin-bottom: 18px;"><strong>${user.username}</strong> (${user.role}) would like to request a screen display post.</p>
            <div style="background: #fff; border-radius: 8px; padding: 18px 16px; margin-bottom: 18px; border: 1px solid #e2e8f0;">
              <h3 style="color: #4CAF50; margin-bottom: 8px;">Post Content</h3>
              <p style="font-size: 16px; color: #333; margin: 0; white-space: pre-line;">${text}</p>
            </div>`;
        if (img) {
          html += `
            <div style="background: #fff; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; text-align: center;">
              <h3 style="color: #4CAF50; margin-bottom: 8px;">Attached Image</h3>
              <img src="${img}" alt="Post Image" style="max-width: 100%; border-radius: 8px; margin-top: 8px; box-shadow: 0 2px 8px rgba(44,62,80,0.08);" />
            </div>`;
        }
        html += `
            <p style="color: #666; font-size: 12px; margin-top: 24px;">This post was sent to the TV screen by Pear Network.</p>
          </div>`;
        await transporter.sendMail({
          from: "pearnet104@gmail.com",
          to: "shannington@brookhouse.ac.ke",
          subject: "New Post for TV Screen",
          html
        });
        console.log("TV post email sent to shannington@brookhouse.ac.ke");
      } catch (tvErr) {
        console.error("Error sending TV post email:", tvErr);
      }
    }

    // Populate post data for response
    const populatedPost = await Post.findById(newPost._id)
      .populate("postedBy", "username profilePic")
      .populate("targetGroups", "name color");

    // Send notifications if post is approved
    if (user.role !== "student" || newPost.reviewStatus === "approved") {
      try {
        const usersToNotify = await User.find({ notificationPreferences: true, _id: { $ne: postedBy } });
        const notificationPromises = usersToNotify.map(recipient =>
          sendNotificationEmail(recipient.email, postedBy, newPost._id, user.username)
        );
        await Promise.allSettled(notificationPromises);
      } catch (notificationError) {
        console.error("Error sending notifications:", notificationError);
      }
    }

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("Error in createPost:", err);
    res.status(500).json({ error: err.message || "Failed to create post" });
  }
};

// controllers/postController.js
const getPendingReviews = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user = await User.findById(req.user._id).populate("reviewerGroups");
    
    const reviewerGroupIds = user.reviewerGroups
      .filter(g => g.permissions && g.permissions.postReview)
      .map(g => g._id);

    const pendingReviews = await Post.find({
      reviewStatus: 'pending',
      $or: [
        { "reviewers.userId": req.user._id },
        { "reviewerGroups": { $in: reviewerGroupIds } }
      ]
    }).populate('postedBy', 'username profilePic email');

    console.log("Found pending reviews:", pendingReviews);
    res.status(200).json(pendingReviews);
  } catch (err) {
    console.error("Error in getPendingReviews:", err);
    res.status(500).json({ 
      error: "Error fetching pending reviews", 
      details: err.message 
    });
  }
};
// New function to handle post reviews
const reviewPost = async (req, res) => {
  try {
        // Add this check at the beginning
        if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
          return res.status(400).json({ error: "Invalid post ID" });
        }
    // Add debugging logs
    console.log("Review request received:", {
      user: req.user,
      params: req.params,
      body: req.body
    });

    // Check if user is authenticated
    if (!req.user) {
      console.log("Authentication failed: No user in request");
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Check if user is authorized to review (admin or teacher)
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      console.log("Authorization failed: User role is", req.user.role);
      return res.status(401).json({ error: "Not authorized to review posts" });
    }

    const { postId } = req.params;
    const { decision } = req.body;
    const reviewerId = req.user._id;

    // Add this check at the beginning of reviewPost
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    console.log("Looking for post:", postId);
    const post = await Post.findById(postId);
    
    if (!post) {
      console.log("Post not found:", postId);
      return res.status(404).json({ error: "Post not found" });
    }

    console.log("Found post:", post);
    console.log("Looking for reviewer:", reviewerId);

    // Find the reviewer's entry
    const reviewerIndex = post.reviewers.findIndex(
      r => r.userId.toString() === reviewerId.toString()
    );

    console.log("Reviewer index:", reviewerIndex);

    if (reviewerIndex === -1) {
      console.log("Reviewer not found in post.reviewers");
      return res.status(401).json({ error: "Not authorized to review this post" });
    }

    // Update reviewer's decision
    post.reviewers[reviewerIndex].decision = decision;
    post.reviewers[reviewerIndex].reviewedAt = new Date();

    // In the reviewPost function, add this before saving
    post.reviewedBy.push({
      user: reviewerId,
      decision,
      decisionDate: new Date()
    });

    // Check review status
    if (decision === 'approved') {
      // Check if any admin or teacher has approved
      const hasApproval = post.reviewers.some(
        r => (r.role === 'admin' || r.role === 'teacher') && r.decision === 'approved'
      );

      if (hasApproval) {
        post.reviewStatus = 'approved';
        console.log("Post approved");
        
        // Send notifications now that post is approved
        try {
          const poster = await User.findById(post.postedBy);
          const usersToNotify = await User.find({
            notificationPreferences: true,
            _id: { $ne: post.postedBy },
          });

          const notificationPromises = usersToNotify.map((recipient) =>
            sendNotificationEmail(recipient.email, postedBy, newPost._id, user.username)
          );

          await Promise.allSettled(notificationPromises);
        } catch (error) {
          console.error("Error sending notifications:", error);
        }
      }
    } else if (decision === 'rejected') {
      // If any admin or teacher rejects, post is rejected
      const hasRejection = post.reviewers.some(
        r => (r.role === 'admin' || r.role === 'teacher') && r.decision === 'rejected'
      );
      
      if (hasRejection) {
        post.reviewStatus = 'rejected';
        console.log("Post rejected");
      }
    }

    await post.save();
    console.log("Post saved successfully");
    res.status(200).json(post);
  } catch (err) {
    console.error("Error in reviewPost:", err);
    res.status(500).json({ error: err.message });
  }
};

const toggleNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { emailNotifications, webPushNotifications } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update notification preferences
    user.notificationPreferences = {
      email: emailNotifications,
      webPush: webPushNotifications
    };
    await user.save();

    res.status(200).json({
      message: "Notification preferences updated",
      notificationPreferences: user.notificationPreferences
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update getPost to track views if not already viewed
const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user?._id;

    // First get the post without population to check if it exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Now populate the post with user data
    const populatedPost = await Post.findById(postId)
      .populate({
        path: "postedBy",
        select: "username profilePic email role",
        options: { lean: true }
      })
      .populate("targetGroups", "name color")
      .lean();

    // If postedBy is null or missing, provide fallback values
    if (!populatedPost.postedBy) {
      populatedPost.postedBy = {
        username: "Unknown User",
        profilePic: "https://res.cloudinary.com/dxq7q0y0y/image/upload/v1/default_profile_pic.png",
        role: "user"
      };
    }

    // Check if user already viewed using atomic update
    if (userId) {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: postId, views: { $ne: userId } },
        { $addToSet: { views: userId } },
        { new: true }
      );
      if (updatedPost) {
        Object.assign(populatedPost, updatedPost.toObject());
      }
    }

    // Ensure createdAt is properly formatted as ISO string
    if (!populatedPost.createdAt) {
      populatedPost.createdAt = new Date().toISOString();
    } else {
      populatedPost.createdAt = populatedPost.createdAt.toISOString ? 
        populatedPost.createdAt.toISOString() : 
        new Date(populatedPost.createdAt).toISOString();
    }

    // Ensure arrays are initialized
    populatedPost.likes = populatedPost.likes || [];
    populatedPost.reposts = populatedPost.reposts || [];
    populatedPost.views = populatedPost.views || [];
    populatedPost.viewCount = populatedPost.views.length;
    populatedPost.isViewed = userId ? populatedPost.views.includes(userId) : false;

    if (userId) {
      populatedPost.isLiked = populatedPost.likes.includes(userId.toString());
      populatedPost.isReposted = populatedPost.reposts.includes(userId.toString());
    }

    // Add some additional logging for debugging
    console.log("Post data:", {
      id: populatedPost._id,
      postedBy: populatedPost.postedBy,
      createdAt: populatedPost.createdAt
    });

    res.status(200).json(populatedPost);
  } catch (err) {
    console.error("Error in getPost:", err);
    res.status(500).json({ error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Allow deletion if user is post creator OR admin
    if (
      post.postedBy.toString() !== req.user._id.toString() && 
      req.user.role !== "admin"
    ) {
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

    // Define allowed emoji reactions
    const allowedEmojis = ["😊", "👍", "🔥", "👏"];
    if (!allowedEmojis.includes(text)) {
      return res.status(400).json({ error: "Please choose a valid reaction" });
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

    // Ensure reposts array exists (fix here)
    if (!post.reposts) {
      post.reposts = [];
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
// new code
const addViewToPost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already viewed the post
    if (!post.views.includes(userId)) {
      post.views.push(userId);
      await post.save();
    }

    res.status(200).json({ message: "View recorded", viewCount: post.views.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const pendingPostId = req.query.pendingPostId;
    let matchOr = [
      { reviewStatus: "approved" },
      { "postedBy.role": { $in: ["admin", "teacher"] } }
    ];
    if (pendingPostId && mongoose.Types.ObjectId.isValid(pendingPostId)) {
      matchOr.unshift({ _id: mongoose.Types.ObjectId(pendingPostId) });
    }

    const user = await User.findById(userId)
      .populate("groups")
      .select("following yearGroup department role groups");

    if (!user) return res.status(404).json({ error: "User not found" });

    const userGroupIds = user.groups.map(g => g._id);
    const followingIds = user.following || [];

    // Construct aggregation pipeline
    const pipeline = [
      { $match: { $or: matchOr } },
      // Populate postedBy information
      { $lookup: {
          from: "users",
          localField: "postedBy",
          foreignField: "_id",
          as: "postedBy",
          pipeline: [{ $project: { username: 1, profilePic: 1, role: 1 } }]
      }},
      { $unwind: "$postedBy" },
      // Add audience matching
      { $addFields: {
        matchesAudience: {
          $cond: {
            if: { $eq: [user.role, "student"] },
            then: { $or: [
              { $eq: ["$targetAudience", "all"] },
              { $in: [user.yearGroup, "$targetYearGroups"] },
              { $eq: ["$targetAudience", user.yearGroup] }
            ]},
            else: { $or: [
              { $eq: ["$targetAudience", "all"] },
              { $in: [user.department, "$targetDepartments"] },
              { $eq: ["$targetAudience", user.department] }
            ]}
          }
        },
        matchesBase: {
          $or: [
            { $eq: ["$postedBy._id", userId] },
            { $in: ["$postedBy._id", followingIds] },
            { $in: [userId, "$reposts"] },
            { $eq: ["$isGeneral", true] },
            { $gt: [{ $size: { $setIntersection: ["$targetGroups", userGroupIds] } }, 0] }
          ]
        }
      }},
      // Final matching
      { $match: {
        $and: [
          { matchesAudience: true },
          { matchesBase: true }
        ]
      }},
      // Add view status
      { $addFields: {
        viewCount: { $size: "$views" },
        isViewed: { $in: [userId, "$views"] }
      }},
      // Sorting and limiting
      { $sort: { createdAt: -1 } },
      { $limit: 50 }
    ];

    const feedPosts = await Post.aggregate(pipeline);
    res.status(200).json(feedPosts);

  } catch (err) {
    console.error("Error fetching feed posts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Ensure this is exported if part of a larger module

const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find posts where the user is either the poster or has reposted
    const posts = await Post.find({
      $or: [
        { postedBy: user._id },
        { reposts: user._id }
      ]
    })
    .populate("postedBy", "username profilePic")
    .populate("targetGroups", "name color")
    .sort({ createdAt: -1 });

    // Enhanced view tracking
    const viewPromises = posts.map(async post => {
      // Track views if user is logged in
      if (req.user?._id && !post.views.includes(req.user._id)) {
        post.views.push(req.user._id);
        // Explicitly update view count
        post.viewCount = post.views.length;
        await post.save();
      }
      return post;
    });

    // Wait for all view tracking to complete
    const updatedPosts = await Promise.all(viewPromises);

    // Return the posts as JSON
    res.status(200).json(updatedPosts);
  } catch (error) {
    console.error("Error in getUserPosts:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
      const { commentId } = req.params;

      // Find the post containing the comment
      const post = await Post.findOne({ "replies._id": commentId });
      if (!post) {
          return res.status(404).json({ error: "Post not found" });
      }

      // Find the comment
      const comment = post.replies.id(commentId);
      if (!comment) {
          return res.status(404).json({ error: "Comment not found" });
      }

      // Authorization check
      if (req.user.role !== "admin" && comment.userId.toString() !== req.user._id.toString()) {
          return res.status(403).json({ error: "Unauthorized to delete comment" });
      }

      // Remove the comment from the array
      post.replies.pull(commentId);
      await post.save();

      res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
  // Add this function alongside your other controller functions
};
// In postController.js
const searchPosts = async (query) => {
  return Post.find({
    $text: { $search: query },
    reviewStatus: 'approved'
  })
  .limit(5)
  .populate('postedBy', 'username');
};

export {
  searchPosts,
  addViewToPost,
  createPost,
  deleteComment,
  getPendingReviews,
  reviewPost,
  repostPost,
  toggleNotifications,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
  notifyReviewers,
};