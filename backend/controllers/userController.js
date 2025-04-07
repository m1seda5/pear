// this is the orginal version
// import User from "../models/userModel.js";
// import Post from "../models/postModel.js";
// import bcrypt from "bcryptjs";
// import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
// import { v2 as cloudinary } from "cloudinary";
// import mongoose from "mongoose";

// const getUserProfile = async (req, res) => {
// 	// We will fetch user profile either with username or userId
// 	// query is either username or userId
// 	const { query } = req.params;

// 	try {
// 		let user;

// 		// query is userId
// 		if (mongoose.Types.ObjectId.isValid(query)) {
// 			user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
// 		} else {
// 			// query is username
// 			user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
// 		}

// 		if (!user) return res.status(404).json({ error: "User not found" });

// 		res.status(200).json(user);
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 		console.log("Error in getUserProfile: ", err.message);
// 	}
// };

// const signupUser = async (req, res) => {
// 		try {
// 			const { name, email, username, password } = req.body;
// 			const user = await User.findOne({ $or: [{ email }, { username }] });

// 			if (user) {
// 				return res.status(400).json({ error: "User already exists" });
// 			}
// 			const salt = await bcrypt.genSalt(10);
// 			const hashedPassword = await bcrypt.hash(password, salt);

// 			const newUser = new User({
// 				name,
// 				email,
// 				username,
// 				password: hashedPassword,
// 			});
// 			await newUser.save();

// 			if (newUser) {
// 				generateTokenAndSetCookie(newUser._id, res);

// 				res.status(201).json({
// 					_id: newUser._id,
// 					name: newUser.name,
// 					email: newUser.email,
// 					username: newUser.username,
// 					bio: newUser.bio,
// 					profilePic: newUser.profilePic,
// 				});
// 			} else {
// 				res.status(400).json({ error: "Invalid user data" });
// 			}
// 		} catch (err) {
// 			res.status(500).json({ error: err.message });
// 			console.log("Error in signupUser: ", err.message);
// 		}
// 	};

// const loginUser = async (req, res) => {
// 	try {
// 		const { username, password } = req.body;
// 		const user = await User.findOne({ username });
// 		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

// 		if (!user || !isPasswordCorrect) {
// 			return res.status(400).json({ error: "Invalid username or password" });
// 		}

// 		if (user.isFrozen) {
// 			user.isFrozen = false;
// 			await user.save();
// 		}

// 		// Start of auto-follow everyone code
// 		const allUsers = await User.find({});
// 		const allUserIds = allUsers.map(u => u._id.toString());
// 		user.following = allUserIds;
// 		await user.save();
// 		// End of auto-follow everyone code

// 		// Send back the role to the front-end so it knows whether the user is a teacher or student
// 		generateTokenAndSetCookie(user._id, res);

// 		res.status(200).json({
// 			_id: user._id,
// 			name: user.name,
// 			email: user.email,
// 			username: user.username,
// 			bio: user.bio,
// 			profilePic: user.profilePic,
// 			role: user.role,  // Include the role in the response
// 			message: "Login successful, now following all users including yourself."
// 		});
// 	} catch (error) {
// 		res.status(500).json({ error: error.message });
// 		console.log("Error in loginUser: ", error.message);
// 	}
// };

// const logoutUser = (req, res) => {
// 	try {
// 		res.cookie("jwt", "", { maxAge: 1 });
// 		res.status(200).json({ message: "User logged out successfully" });
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 		console.log("Error in logoutUser: ", err.message);
// 	}
// };

// const followUnFollowUser = async (req, res) => {
// 	try {
// 		const { id } = req.params;
// 		const userToModify = await User.findById(id);
// 		const currentUser = await User.findById(req.user._id);

// 		if (id === req.user._id.toString())
// 			return res.status(400).json({ error: "You cannot follow/unfollow yourself" });

// 		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

// 		const isFollowing = currentUser.following.includes(id);

// 		if (isFollowing) {
// 			// Unfollow user
// 			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
// 			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
// 			res.status(200).json({ message: "User unfollowed successfully" });
// 		} else {
// 			// Follow user
// 			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
// 			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
// 			res.status(200).json({ message: "User followed successfully" });
// 		}
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 		console.log("Error in followUnFollowUser: ", err.message);
// 	}
// };

// const updateUser = async (req, res) => {
// 	const { name, email, username, password, bio } = req.body;
// 	let { profilePic } = req.body;

// 	const userId = req.user._id;
// 	try {
// 		let user = await User.findById(userId);
// 		if (!user) return res.status(400).json({ error: "User not found" });

// 		if (req.params.id !== userId.toString())
// 			return res.status(400).json({ error: "You cannot update other user's profile" });

// 		if (password) {
// 			const salt = await bcrypt.genSalt(10);
// 			const hashedPassword = await bcrypt.hash(password, salt);
// 			user.password = hashedPassword;
// 		}

// 		if (profilePic) {
// 			if (user.profilePic) {
// 				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
// 			}

// 			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
// 			profilePic = uploadedResponse.secure_url;
// 		}

// 		user.name = name || user.name;
// 		user.email = email || user.email;
// 		user.username = username || user.username;
// 		user.profilePic = profilePic || user.profilePic;
// 		user.bio = bio || user.bio;

// 		user = await user.save();

// 		// Find all posts that this user replied and update username and userProfilePic fields
// 		await Post.updateMany(
// 			{ "replies.userId": userId },
// 			{
// 				$set: {
// 					"replies.$[reply].username": user.username,
// 					"replies.$[reply].userProfilePic": user.profilePic,
// 				},
// 			},
// 			{ arrayFilters: [{ "reply.userId": userId }] }
// 		);

// 		// password should be null in response
// 		user.password = null;

// 		res.status(200).json(user);
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 		console.log("Error in updateUser: ", err.message);
// 	}
// };

// // Start of integration code
// const getSuggestedUsers = async (req, res) => {
// 	try {
// 		// exclude the current user from suggested users array and exclude users that current user is already following
// 		const userId = req.user._id;

// 		const usersFollowedByYou = await User.findById(userId).select("following");

// 		const users = await User.aggregate([
// 			{
// 				$match: {
// 					_id: { $ne: userId },
// 				},
// 			},
// 			{
// 				$sample: { size: 10 },
// 			},
// 		]);
// 		const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));
// 		const suggestedUsers = filteredUsers.slice(0, 4);

// 		suggestedUsers.forEach((user) => (user.password = null));

// 		res.status(200).json(suggestedUsers);
// 	} catch (error) {
// 		res.status(500).json({ error: error.message });
// 	}
// };

// const freezeAccount = async (req, res) => {
// 	try {
// 		const user = await User.findById(req.user._id);
// 		if (!user) {
// 			return res.status(400).json({ error: "User not found" });
// 		}

// 		user.isFrozen = true;
// 		await user.save();

// 		res.status(200).json({ success: true });
// 	} catch (error) {
// 		res.status(500).json({ error: error.message });
// 	}
// };

// // New function for awarding verification
// const awardVerification = async (req, res) => {
//     const { userId, verificationType } = req.body;

//     // Validate verification type
//     if (!['blue', 'gold'].includes(verificationType)) {
//         return res.status(400).json({ error: "Invalid verification type" });
//     }

//     try {
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         // Set the verification type
//         user.verification = verificationType;
//         await user.save();

//         res.status(200).json({ message: "Verification awarded", user });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//         console.log("Error in awardVerification: ", error.message);
//     }
// };
// // End of integration code

// export {
// 	signupUser,
// 	loginUser,
// 	logoutUser,
// 	followUnFollowUser,
// 	updateUser,
// 	getUserProfile,
// 	getSuggestedUsers,
// 	freezeAccount,
// 	awardVerification,  // Exporting the new function
// };

// admin role update (working)firstversion
// import User from "../models/userModel.js";
// import Post from "../models/postModel.js";
// import bcrypt from "bcryptjs";
// import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
// import { v2 as cloudinary } from "cloudinary";
// import mongoose from "mongoose";

// const getUserProfile = async (req, res) => {
//   // We will fetch user profile either with username or userId
//   // query is either username or userId
//   const { query } = req.params;

//   try {
//     let user;

//     // query is userId
//     if (mongoose.Types.ObjectId.isValid(query)) {
//       user = await User.findOne({ _id: query })
//         .select("-password")
//         .select("-updatedAt");
//     } else {
//       // query is username
//       user = await User.findOne({ username: query })
//         .select("-password")
//         .select("-updatedAt");
//     }

//     if (!user) return res.status(404).json({ error: "User not found" });

//     res.status(200).json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//     console.log("Error in getUserProfile: ", err.message);
//   }
// };

// const signupUser = async (req, res) => {
//   try {
//     const { name, email, username, password, role, yearGroup, department } = req.body;

//     console.log("Signup request received:", req.body);

//     // Check if user already exists based on email or username
//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create the user with more flexible role handling
//     const newUser = new User({
//       name,
//       email,
//       username,
//       password: hashedPassword,
//       role,
//       // Only set yearGroup if role is student
//       ...(role === "student" ? { yearGroup } : {}),
//       // Only set department if role is teacher
//       ...(role === "teacher" ? { department } : {}),
//     });

//     // Save the user to the database
//     await newUser.save();

//     console.log("User created successfully:", newUser);

//     // Generate token and send response
//     generateTokenAndSetCookie(newUser._id, res);
//     res.status(201).json({
//       _id: newUser._id,
//       name: newUser.name,
//       email: newUser.email,
//       username: newUser.username,
//       role: newUser.role,
//       yearGroup: newUser.yearGroup,
//       department: newUser.department,
//     });
//   } catch (err) {
//     console.error("Detailed Error in signupUser:", {
//       message: err.message,
//       name: err.name,
//       errors: err.errors,
//       stack: err.stack
//     });
//     res.status(500).json({
//       error: "Failed to register user",
//       details: err.message,
//       validationErrors: err.errors
//     });
//   }
// };
// const loginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     const isPasswordCorrect = await bcrypt.compare(
//       password,
//       user?.password || ""
//     );

//     if (!user || !isPasswordCorrect) {
//       return res.status(400).json({ error: "Invalid username or password" });
//     }

//     if (user.isFrozen) {
//       user.isFrozen = false;
//       await user.save();
//     }

//     // Start of auto-follow everyone code
//     const allUsers = await User.find({});
//     const allUserIds = allUsers.map((u) => u._id.toString());
//     user.following = allUserIds;
//     await user.save();
//     // End of auto-follow everyone code

//     // Send back the role to the front-end so it knows whether the user is a teacher or student
//     generateTokenAndSetCookie(user._id, res);

//     res.status(200).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       username: user.username,
//       bio: user.bio,
//       profilePic: user.profilePic,
//       role: user.role, // Include the role in the response
//       message: "Login successful, now following all users including yourself.",
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//     console.log("Error in loginUser: ", error.message);
//   }
// };

// const logoutUser = (req, res) => {
//   try {
//     res.cookie("jwt", "", { maxAge: 1 });
//     res.status(200).json({ message: "User logged out successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//     console.log("Error in logoutUser: ", err.message);
//   }
// };

// const followUnFollowUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userToModify = await User.findById(id);
//     const currentUser = await User.findById(req.user._id);

//     if (id === req.user._id.toString())
//       return res
//         .status(400)
//         .json({ error: "You cannot follow/unfollow yourself" });

//     if (!userToModify || !currentUser)
//       return res.status(400).json({ error: "User not found" });

//     const isFollowing = currentUser.following.includes(id);

//     if (isFollowing) {
//       // Unfollow user
//       await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
//       await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
//       res.status(200).json({ message: "User unfollowed successfully" });
//     } else {
//       // Follow user
//       await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
//       await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
//       res.status(200).json({ message: "User followed successfully" });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//     console.log("Error in followUnFollowUser: ", err.message);
//   }
// };

// const updateUser = async (req, res) => {
//   const { name, email, username, password, bio } = req.body;
//   let { profilePic } = req.body;

//   const userId = req.user._id;
//   try {
//     let user = await User.findById(userId);
//     if (!user) return res.status(400).json({ error: "User not found" });

//     if (req.params.id !== userId.toString())
//       return res
//         .status(400)
//         .json({ error: "You cannot update other user's profile" });

//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);
//       user.password = hashedPassword;
//     }

//     if (profilePic) {
//       if (user.profilePic) {
//         await cloudinary.uploader.destroy(
//           user.profilePic.split("/").pop().split(".")[0]
//         );
//       }

//       const uploadedResponse = await cloudinary.uploader.upload(profilePic);
//       profilePic = uploadedResponse.secure_url;
//     }

//     user.name = name || user.name;
//     user.email = email || user.email;
//     user.username = username || user.username;
//     user.profilePic = profilePic || user.profilePic;
//     user.bio = bio || user.bio;

//     user = await user.save();

//     // Find all posts that this user replied and update username and userProfilePic fields
//     await Post.updateMany(
//       { "replies.userId": userId },
//       {
//         $set: {
//           "replies.$[reply].username": user.username,
//           "replies.$[reply].userProfilePic": user.profilePic,
//         },
//       },
//       { arrayFilters: [{ "reply.userId": userId }] }
//     );

//     // password should be null in response
//     user.password = null;

//     res.status(200).json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//     console.log("Error in updateUser: ", err.message);
//   }
// };

// // Start of integration code
// const getSuggestedUsers = async (req, res) => {
//   try {
//     // exclude the current user from suggested users array and exclude users that current user is already following
//     const userId = req.user._id;

//     const usersFollowedByYou = await User.findById(userId).select("following");

//     const users = await User.aggregate([
//       {
//         $match: {
//           _id: { $ne: userId },
//         },
//       },
//       {
//         $sample: { size: 10 },
//       },
//     ]);
//     const filteredUsers = users.filter(
//       (user) => !usersFollowedByYou.following.includes(user._id)
//     );
//     const suggestedUsers = filteredUsers.slice(0, 4);

//     suggestedUsers.forEach((user) => (user.password = null));

//     res.status(200).json(suggestedUsers);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const freezeAccount = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(400).json({ error: "User not found" });
//     }

//     user.isFrozen = true;
//     await user.save();

//     res.status(200).json({ success: true });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // New function for awarding verification
// const awardVerification = async (req, res) => {
//   const { userId, verificationType } = req.body;

//   // Validate verification type
//   if (!["blue", "gold"].includes(verificationType)) {
//     return res.status(400).json({ error: "Invalid verification type" });
//   }

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Set the verification type
//     user.verification = verificationType;
//     await user.save();

//     res.status(200).json({ message: "Verification awarded", user });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//     console.log("Error in awardVerification: ", error.message);
//   }
// };
// // End of integration code

// export {
//   signupUser,
//   loginUser,
//   logoutUser,
//   followUnFollowUser,
//   updateUser,
//   getUserProfile,
//   getSuggestedUsers,
//   freezeAccount,
//   awardVerification, // Exporting the new function
// };

// email verification update(working)
// import User from "../models/userModel.js";
// import Post from "../models/postModel.js";
// import bcrypt from "bcryptjs";
// import crypto from "crypto";
// import nodemailer from "nodemailer";
// import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
// import { v2 as cloudinary } from "cloudinary";
// import Conversation from "../models/conversationModel.js";
// import Message from "../models/messageModel.js";
// import mongoose from "mongoose";
// import TempUser from "../models/tempUserModel.js";

// const getUserProfile = async (req, res) => {
//   // We will fetch user profile either with username or userId
//   // query is either username or userId
//   const { query } = req.params;

//   try {
//     let user;

//     // query is userId
//     if (mongoose.Types.ObjectId.isValid(query)) {
//       user = await User.findOne({ _id: query })
//         .select("-password")
//         .select("-updatedAt");
//     } else {
//       // query is username
//       user = await User.findOne({ username: query })
//         .select("-password")
//         .select("-updatedAt");
//     }

//     if (!user) return res.status(404).json({ error: "User not found" });

//     res.status(200).json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//     console.log("Error in getUserProfile: ", err.message);
//   }
// };

// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   auth: {
//     user: "81d810001@smtp-brevo.com",
//     pass: "6IBdE9hsKrHUxD4G",
//   },
// });


// const generateOTP = () => {
//   return crypto.randomInt(1000, 10000);
// };

// const sendOTPEmail = async (email, otp) => {
//   const mailOptions = {
//     from: "pearnet104@gmail.com",
//     to: email,
//     subject: "Your OTP Code",
//     text: `Your OTP code is ${otp}. It will expire in 2 minutes.`,
//   };

//   console.log(`Sending OTP Email to ${email} with OTP ${otp}`);
//   await transporter.sendMail(mailOptions);
// };

// const MAX_OTP_ATTEMPTS = 3;
// const OTP_COOLDOWN = 2 * 60 * 1000; // 2 minutes in milliseconds

// const signupUser = async (req, res) => {
//   console.log("Signup request received:", req.body);

//   try {
//     const { name, email, username, password, role, yearGroup, department } = req.body;

//     // Check for banned email first
//     const bannedUser = await User.findOne({ email, isBanned: true });
//     if (bannedUser) {
//       return res.status(403).json({ error: "This email is permanently banned" });
//     }

//     // Check for existing user
//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     // Check for existing temporary signup
//     const existingTemp = await TempUser.findOne({ email });
//     if (existingTemp) {
//       // Check cooldown period
//       const timeSinceLastOtp = Date.now() - existingTemp.lastOtpSent;
//       if (timeSinceLastOtp < OTP_COOLDOWN) {
//         const remainingTime = Math.ceil((OTP_COOLDOWN - timeSinceLastOtp) / 1000);
//         return res.status(429).json({ 
//           error: `Please wait ${remainingTime} seconds before requesting another OTP`
//         });
//       }
//     }

//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + OTP_COOLDOWN);

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Store in temporary collection
//     const tempUser = new TempUser({
//       name,
//       email,
//       username,
//       password: hashedPassword,
//       role,
//       otp,
//       otpExpiry,
//       ...(role === "student" ? { yearGroup } : {}),
//       ...(role === "teacher" ? { department } : {}),
//     });

//     await tempUser.save();
//     await sendOTPEmail(email, otp);

//     res.status(200).json({
//       message: "OTP sent to email. Please verify within 2 minutes.",
//       email: email
//     });

//   } catch (err) {
//     console.error("Error in signupUser:", err.message);
//     res.status(500).json({
//       error: "Failed to initiate signup",
//       details: err.message,
//     });
//   }
// };

// const verifyOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.status(400).json({ error: "Email and OTP are required" });
//     }

//     const tempUser = await TempUser.findOne({ email });

//     if (!tempUser) {
//       return res.status(404).json({ error: "No pending verification found" });
//     }

//     if (tempUser.otpAttempts >= MAX_OTP_ATTEMPTS) {
//       await TempUser.deleteOne({ email });
//       return res.status(429).json({ 
//         error: "Maximum OTP attempts exceeded. Please start signup process again." 
//       });
//     }

//     const receivedOTP = parseInt(otp, 10);

//     if (tempUser.otp !== receivedOTP) {
//       tempUser.otpAttempts += 1;
//       await tempUser.save();
//       return res.status(400).json({ 
//         error: `Invalid OTP. ${MAX_OTP_ATTEMPTS - tempUser.otpAttempts} attempts remaining.`
//       });
//     }

//     if (Date.now() > tempUser.otpExpiry) {
//       return res.status(400).json({ error: "OTP expired" });
//     }

//     // Create actual user after successful verification
//     const newUser = new User({
//       name: tempUser.name,
//       email: tempUser.email,
//       username: tempUser.username,
//       password: tempUser.password,
//       role: tempUser.role,
//       isVerified: true,
//       yearGroup: tempUser.yearGroup,
//       department: tempUser.department
//     });

//     await newUser.save();
//     await TempUser.deleteOne({ email });

//     // Generate token and set cookie
//     generateTokenAndSetCookie(newUser._id, res);

//     res.status(200).json({
//       message: "User verified and created successfully",
//       _id: newUser._id,
//       name: newUser.name,
//       email: newUser.email,
//       username: newUser.username,
//       role: newUser.role,
//       yearGroup: newUser.yearGroup,
//       department: newUser.department,
//       isVerified: true,
//     });
//   } catch (err) {
//     console.error("Verify OTP error:", err.message || err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// const resendOTP = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const tempUser = await TempUser.findOne({ email });
//     if (!tempUser) {
//       return res.status(404).json({ error: "No pending verification found" });
//     }

//     const timeSinceLastOtp = Date.now() - tempUser.lastOtpSent;
//     if (timeSinceLastOtp < OTP_COOLDOWN) {
//       const remainingTime = Math.ceil((OTP_COOLDOWN - timeSinceLastOtp) / 1000);
//       return res.status(429).json({ 
//         error: `Please wait ${remainingTime} seconds before requesting another OTP`
//       });
//     }

//     const newOtp = generateOTP();
//     tempUser.otp = newOtp;
//     tempUser.otpExpiry = new Date(Date.now() + OTP_COOLDOWN);
//     tempUser.lastOtpSent = new Date();
//     await tempUser.save();

//     await sendOTPEmail(email, newOtp);

//     res.status(200).json({
//       message: "New OTP sent successfully",
//       email: email
//     });
//   } catch (err) {
//     console.error("Resend OTP error:", err.message);
//     res.status(500).json({ error: "Failed to resend OTP" });
//   }
// };


// const loginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;
    
//     // First find the user by username
//     const user = await User.findOne({ username });
    
//     // Check credentials before checking ban status
//     const isPasswordCorrect = await bcrypt.compare(
//       password,
//       user?.password || ""
//     );

//     if (!user || !isPasswordCorrect) {
//       return res.status(400).json({ error: "Invalid username or password" });
//     }

//     // Now check if the user is banned
//     if (user.isBanned) {
//       return res.status(403).json({ error: "Account permanently banned" });
//     }

//     // Rest of the login logic remains the same
//     if (user.isFrozen) {
//       user.isFrozen = false;
//       await user.save();
//     }

//     // Auto-follow logic
//     const allUsers = await User.find({});
//     const allUserIds = allUsers.map((u) => u._id.toString());
//     user.following = allUserIds;
//     await user.save();

//     generateTokenAndSetCookie(user._id, res);

//     res.status(200).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       username: user.username,
//       bio: user.bio,
//       profilePic: user.profilePic,
//       role: user.role,
//       message: "Login successful, now following all users including yourself.",
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//     console.log("Error in loginUser: ", error.message);
//   }
// };

// const logoutUser = (req, res) => {
//   try {
//     res.cookie("jwt", "", { maxAge: 1 });
//     res.status(200).json({ message: "User logged out successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//     console.log("Error in logoutUser: ", err.message);
//   }
// };

// const followUnFollowUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userToModify = await User.findById(id);
//     const currentUser = await User.findById(req.user._id);

//     if (id === req.user._id.toString())
//       return res
//         .status(400)
//         .json({ error: "You cannot follow/unfollow yourself" });

//     if (!userToModify || !currentUser)
//       return res.status(400).json({ error: "User not found" });

//     const isFollowing = currentUser.following.includes(id);

//     if (isFollowing) {
//       // Unfollow user
//       await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
//       await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
//       res.status(200).json({ message: "User unfollowed successfully" });
//     } else {
//       // Follow user
//       await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
//       await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
//       res.status(200).json({ message: "User followed successfully" });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//     console.log("Error in followUnFollowUser: ", err.message);
//   }
// };

// const updateUser = async (req, res) => {
//   const { name, email, username, password, bio } = req.body;
//   let { profilePic } = req.body;

//   const userId = req.user._id;
//   try {
//     let user = await User.findById(userId);
//     if (!user) return res.status(400).json({ error: "User not found" });

//     if (req.params.id !== userId.toString())
//       return res
//         .status(400)
//         .json({ error: "You cannot update other user's profile" });

//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);
//       user.password = hashedPassword;
//     }

//     if (profilePic) {
//       if (user.profilePic) {
//         await cloudinary.uploader.destroy(
//           user.profilePic.split("/").pop().split(".")[0]
//         );
//       }

//       const uploadedResponse = await cloudinary.uploader.upload(profilePic);
//       profilePic = uploadedResponse.secure_url;
//     }

//     user.name = name || user.name;
//     user.email = email || user.email;
//     user.username = username || user.username;
//     user.profilePic = profilePic || user.profilePic;
//     user.bio = bio || user.bio;

//     user = await user.save();

//     // Find all posts that this user replied and update username and userProfilePic fields
//     await Post.updateMany(
//       { "replies.userId": userId },
//       {
//         $set: {
//           "replies.$[reply].username": user.username,
//           "replies.$[reply].userProfilePic": user.profilePic,
//         },
//       },
//       { arrayFilters: [{ "reply.userId": userId }] }
//     );

//     // password should be null in response
//     user.password = null;

//     res.status(200).json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//     console.log("Error in updateUser: ", err.message);
//   }
// };

// // Start of integration code
// const getSuggestedUsers = async (req, res) => {
//   try {
//     // exclude the current user from suggested users array and exclude users that current user is already following
//     const userId = req.user._id;

//     const usersFollowedByYou = await User.findById(userId).select("following");

//     const users = await User.aggregate([
//       {
//         $match: {
//           _id: { $ne: userId },
//         },
//       },
//       {
//         $sample: { size: 10 },
//       },
//     ]);
//     const filteredUsers = users.filter(
//       (user) => !usersFollowedByYou.following.includes(user._id)
//     );
//     const suggestedUsers = filteredUsers.slice(0, 4);

//     suggestedUsers.forEach((user) => (user.password = null));

//     res.status(200).json(suggestedUsers);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const freezeAccount = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(400).json({ error: "User not found" });
//     }

//     user.isFrozen = true;
//     await user.save();

//     res.status(200).json({ success: true });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // New function for awarding verification
// const awardVerification = async (req, res) => {
//   const { userId, verificationType } = req.body;

//   // Validate verification type
//   if (!["blue", "gold"].includes(verificationType)) {
//     return res.status(400).json({ error: "Invalid verification type" });
//   }

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Set the verification type
//     user.verification = verificationType;
//     await user.save();

//     res.status(200).json({ message: "Verification awarded", user });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//     console.log("Error in awardVerification: ", error.message);
//   }
// };
// const adminFreezeUser = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     if (userId === req.user._id.toString()) {
//       return res.status(400).json({ error: "Cannot perform action on yourself" });
//     }

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     if (user.freezeCount >= 1) {
//       user.isBanned = true;
//       user.isFrozen = false;
//       await user.save();

//       // Send ban notification
//       try {
//         await transporter.sendMail({
//           from: "pearnet104@gmail.com",
//           to: user.email,
//           subject: "Account Banned",
//           text: "Your account has been banned. Unfortunately, until the foreseeable future, you will not be able to create an account with us again until further notice."
//         });
//       } catch (emailError) {
//         console.error("Failed to send ban notification:", emailError);
//       }

//       await deleteUserData(userId);
//       return res.json({ banned: true });
//     }

//     user.isFrozen = true;
//     user.freezeCount += 1;
//     user.freezeUntil = new Date(Date.now() + 14 * 86400000);
//     await user.save();

//     // Send freeze notification
//     try {
//       await transporter.sendMail({
//         from: "pearnet104@gmail.com",
//         to: user.email,
//         subject: "Account Frozen",
//         text: "You won't be able to access chat, commenting, and posting until you are unfrozen after 2 weeks."
//       });
//     } catch (emailError) {
//       console.error("Failed to send freeze notification:", emailError);
//     }

//     res.status(200).json({ success: true });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const adminDeleteUser = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     if (userId === req.user._id.toString()) {
//       return res.status(400).json({ error: "Cannot delete yourself" });
//     }

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ error: "User not found" });

//     // Send ban notification
//     try {
//       await transporter.sendMail({
//         from: "pearnet104@gmail.com",
//         to: user.email,
//         subject: "Account Banned",
//         text: "Your account has been banned. Unfortunately, until the foreseeable future, you will not be able to create an account with us again until further notice."
//       });
//     } catch (emailError) {
//       console.error("Failed to send ban notification:", emailError);
//     }

//     await deleteUserData(userId);
//     res.status(200).json({ success: true });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Add this helper function (implement actual deletion logic)
// // userController.js
// const deleteUserData = async (userId) => {
//   try {
//     // 1. Delete user's posts and associated data
//     await Post.deleteMany({ user: userId });

//     // 2. Remove user's replies from all posts
//     await Post.updateMany(
//       { "replies.userId": userId },
//       { $pull: { replies: { userId: userId } } }
//     );

//     // 3. Handle conversations and messages
//     const userConversations = await Conversation.find({
//       participants: userId,
//     });

//     // Delete all messages in these conversations
//     await Message.deleteMany({
//       conversation: { $in: userConversations.map((c) => c._id) },
//     });

//     // Delete the conversations themselves
//     await Conversation.deleteMany({
//       participants: userId,
//     });

//     // 4. Remove user from social connections
//     await User.updateMany(
//       { $or: [{ followers: userId }, { following: userId }] },
//       { $pull: { followers: userId, following: userId } }
//     );

//     // 5. Remove user from chat participants lists
//     await Conversation.updateMany(
//       { participants: userId },
//       { $pull: { participants: userId } }
//     );

//     // 6. Delete profile picture from Cloudinary
//     const user = await User.findById(userId);
//     if (user?.profilePic) {
//       const publicId = user.profilePic.split("/").pop().split(".")[0];
//       await cloudinary.uploader.destroy(publicId);
//     }

//     // 7. Finally delete the user document
//     await User.findByIdAndDelete(userId);

//     console.log(`Successfully deleted all data for user ${userId}`);
//   } catch (error) {
//     console.error("Error deleting user data:", error);
//     throw error;
//   }
// };
// export {
//   signupUser,
//   verifyOTP,
//   resendOTP,
//   loginUser,
//   logoutUser,
//   followUnFollowUser,
//   updateUser,
//   getUserProfile,
//   getSuggestedUsers,
//   freezeAccount,
//   awardVerification,
//   adminFreezeUser,
//   adminDeleteUser,
//   deleteUserData, // Exporting the new function
// };


// this si the validation updatew 
import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import mongoose from "mongoose";
import TempUser from "../models/tempUserModel.js";

const getUserProfile = async (req, res) => {
  // We will fetch user profile either with username or userId
  // query is either username or userId
  const { query } = req.params;

  try {
    let user;

    // query is userId
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      // query is username
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getUserProfile: ", err.message);
  }
};
const validateEmail = (email) => {
  if (!email) return { isValid: false, error: 'Email is required' };
  
  const emailLower = email.toLowerCase();
  
  // Check for admin exception (pear emails)
  if (emailLower.includes('pear')) {
    return {
      isValid: true,
      emailType: 'admin',
      campus: null,
      userIdentifier: 'pear' // Special case for admin accounts
    };
  }
  
  // Check for Brookhouse domain
  if (!emailLower.includes('brookhouse.ac.ke')) {
    return {
      isValid: false,
      error: 'Please use your Brookhouse email address'
    };
  }

  // Extract user identifier (everything before @)
  const userIdentifier = emailLower.split('@')[0];
  
  // Determine email type and campus
  const isStudent = emailLower.includes('students');
  const isRunda = emailLower.includes('runda');
  
  return {
    isValid: true,
    emailType: isStudent ? 'student' : 'teacher',
    campus: isRunda ? 'runda' : 'karen',
    userIdentifier
  };
};
const validateUsername = (username, email) => {
  if (!username || !email) {
    return { isValid: false, error: 'Username and email are required' };
  }

  const { isValid, emailType, userIdentifier } = validateEmail(email);
  
  if (!isValid) {
    return { isValid: false, error: 'Invalid email' };
  }

  // Special case for admin accounts
  if (emailType === 'admin') {
    if (!username.toLowerCase().includes('pear')) {
      return { 
        isValid: false, 
        error: 'Admin usernames must contain "pear"'
      };
    }
    return { isValid: true };
  }

  // For regular accounts, extract surname from email identifier
  const surname = userIdentifier.slice(1); // Remove first letter to get surname

  if (!username.toLowerCase().includes(surname.toLowerCase())) {
    return {
      isValid: false,
      error: `Username must contain your surname (${surname})`
    };
  }

  return { isValid: true };
};

// Role verification logic
const verifyRoleMatch = (email, selectedRole) => {
  const { isValid, emailType, error } = validateEmail(email);
  
  if (!isValid) {
    return { isValid: false, error };
  }
  
  // Verify role matches email type
  if (emailType === 'student' && selectedRole === 'teacher') {
    return {
      isValid: false,
      error: 'Student emails cannot select teacher roles'
    };
  }
  
  if (emailType === 'teacher' && selectedRole === 'student') {
    return {
      isValid: false,
      error: 'Teacher emails cannot select student roles'
    };
  }
  
  return { 
    isValid: true,
    emailType,
    role: selectedRole
  };
};

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "81d810001@smtp-brevo.com",
    pass: "6IBdE9hsKrHUxD4G",
  },
});


const generateOTP = () => {
  return crypto.randomInt(1000, 10000);
};

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: "pearnet104@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 2 minutes.`,
  };

  console.log(`Sending OTP Email to ${email} with OTP ${otp}`);
  await transporter.sendMail(mailOptions);
};

const MAX_OTP_ATTEMPTS = 3;
const OTP_COOLDOWN = 10 * 60 * 1000;// 7 minutes in milliseconds

const signupUser = async (req, res) => {
  console.log("Signup request received:", req.body);

  try {
    const { name, email, username, password, role, yearGroup, department } = req.body;

    // Check for banned email first
    const bannedUser = await User.findOne({ email, isBanned: true });
    if (bannedUser) {
      return res.status(403).json({ error: "This email is permanently banned" });
    }

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ error: emailValidation.error });
    }

    // Validate username contains surname
    const usernameValidation = validateUsername(username, email);
    if (!usernameValidation.isValid) {
      return res.status(400).json({ error: usernameValidation.error });
    }

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Determine campus based on email
    const emailLower = email.toLowerCase();
    let campus = 'admin';
    if (!emailLower.includes('pear')) {
      campus = emailLower.includes('runda') ? 'runda' : 'karen';
    }

    // Check for existing temporary signup
    const existingTemp = await TempUser.findOne({ email });
    if (existingTemp) {
      // Check cooldown period
      const timeSinceLastOtp = Date.now() - existingTemp.lastOtpSent;
      if (timeSinceLastOtp < OTP_COOLDOWN) {
        const remainingTime = Math.ceil((OTP_COOLDOWN - timeSinceLastOtp) / 1000);
        return res.status(429).json({ 
          error: `Please wait ${remainingTime} seconds before requesting another OTP`
        });
      }
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + OTP_COOLDOWN);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store in temporary collection with campus
    const tempUser = new TempUser({
      name,
      email,
      username,
      password: hashedPassword,
      role,
      campus,
      otp,
      otpExpiry,
      ...(role === "student" ? { yearGroup } : {}),
      ...(role === "teacher" ? { department } : {})
    });

    await tempUser.save();
    await sendOTPEmail(email, otp);

    res.status(200).json({
      message: "OTP sent to email. Please verify within 2 minutes.",
      email: email
    });

  } catch (err) {
    console.error("Error in signupUser:", err.message);
    res.status(500).json({
      error: "Failed to initiate signup",
      details: err.message,
    });
  }
};

// In verifyOTP endpoint (userController.js)
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  
  try {
    // Input validation
    if (!email || !otp) {
      return res.status(400).json({
        error: "Email and OTP are required"
      });
    }
    
    // Find temporary user record
    const tempUser = await TempUser.findOne({ email: email.toLowerCase() });
    if (!tempUser) {
      console.log(`No temporary user found for email: ${email}`);
      return res.status(404).json({
        error: "No pending verification found. Please restart the signup process."
      });
    }
    
    // Log verification attempt
    console.log(`OTP Verification attempt for ${email}:`, {
      receivedOTP: otp,
      storedOTP: tempUser.otp,
      attempts: tempUser.otpAttempts,
      expiry: tempUser.otpExpiry,
      currentTime: new Date()
    });
    
    // Check attempts
    if (tempUser.otpAttempts >= 3) {
      console.log(`Max attempts exceeded for ${email}`);
      await TempUser.deleteOne({ email: email.toLowerCase() });
      return res.status(429).json({
        error: "Maximum attempts exceeded. Please restart the signup process."
      });
    }
    
    // Validate OTP
    if (!tempUser.isValidOtp(otp)) {
      const remainingAttempts = 3 - (await tempUser.incrementAttempts());
      console.log(`Invalid OTP for ${email}. ${remainingAttempts} attempts remaining`);
      
      return res.status(400).json({
        error: `Invalid OTP. ${remainingAttempts} attempts remaining.`
      });
    }
    
    // Prepare user data for creation
    const userData = {
      name: tempUser.name,
      email: tempUser.email,
      username: tempUser.username,
      password: tempUser.password,
      role: tempUser.role,
      campus: tempUser.campus, // Ensure campus is included
      isVerified: true
    };
    
    // Add conditional fields based on role
    if (tempUser.role === 'student') {
      userData.yearGroup = tempUser.yearGroup;
    } else if (tempUser.role === 'teacher') {
      userData.department = tempUser.department;
    }
    
    try {
      // Create new verified user
      const newUser = new User(userData);
      await newUser.save();
      
      // Add this after creating newUser - MODIFICATION 1
      const allUsers = await User.find({ _id: { $ne: newUser._id } });
      const allUserIds = allUsers.map(u => u._id.toString());
      newUser.following = allUserIds;
      await newUser.save();
      
      // Clean up temporary user data
      await TempUser.deleteOne({ email: email.toLowerCase() });
      
      // Generate authentication token - MODIFICATION 2
      const token = generateTokenAndSetCookie(newUser._id, res);
      
      // Log successful verification
      console.log(`Successfully verified and created user: ${email}`);
      
      // Return success response with token
      return res.status(200).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        yearGroup: newUser.yearGroup,
        department: newUser.department,
        campus: newUser.campus,
        isVerified: true,
        token // Added token to response
      });
      
    } catch (error) {
      // Handle user creation errors
      console.error(`Error creating verified user for ${email}:`, error);
      
      // Clean up temp user on failure
      await TempUser.deleteOne({ email: email.toLowerCase() });
      
      // Check for duplicate key errors
      if (error.code === 11000) {
        return res.status(400).json({
          error: "Username or email already exists. Please try again with different credentials."
        });
      }
      
      throw error;
    }
  } catch (error) {
    // Log the full error for debugging
    console.error('OTP Verification Error:', {
      email,
      error: error.message,
      stack: error.stack
    });
    
    // Return appropriate error response
    return res.status(500).json({
      error: "Internal server error during verification. Please try again.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const tempUser = await TempUser.findOne({ email });
    if (!tempUser) {
      return res.status(404).json({ 
        error: "No pending verification found. Please restart signup." 
      });
    }

    // Check cooldown period
    const timeSinceLastOtp = Date.now() - tempUser.lastOtpSent;
    if (timeSinceLastOtp < OTP_COOLDOWN) {
      const remainingTime = Math.ceil((OTP_COOLDOWN - timeSinceLastOtp) / 1000);
      return res.status(429).json({ 
        error: `Please wait ${Math.ceil(remainingTime / 60)} minutes before requesting another OTP`
      });
      
    }

    // Generate and save new OTP
    const newOtp = generateOTP();
    tempUser.otp = newOtp;
    tempUser.otpExpiry = new Date(Date.now() + OTP_COOLDOWN);
    tempUser.lastOtpSent = new Date();
    tempUser.otpAttempts = 0; // Reset attempts for new OTP
    await tempUser.save();

    // Send new OTP
    await sendOTPEmail(email, newOtp);

    res.status(200).json({
      message: "New OTP sent successfully",
      email: email,
      expiryTime: tempUser.otpExpiry
    });

  } catch (err) {
    console.error("Resend OTP error:", err.message);
    res.status(500).json({ 
      error: "Failed to resend OTP. Please try again." 
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // First find the user by username
    const user = await User.findOne({ username });
    
    // Check credentials before checking ban status
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Now check if the user is banned
    if (user.isBanned) {
      return res.status(403).json({ error: "Account permanently banned" });
    }

    // Rest of the login logic remains the same
    if (user.isFrozen) {
      user.isFrozen = false;
      await user.save();
    }

    // Auto-follow logic
    const allUsers = await User.find({});
    const allUserIds = allUsers.map((u) => u._id.toString());
    user.following = allUserIds;
    await user.save();

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
      role: user.role,
      message: "Login successful, now following all users including yourself.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in loginUser: ", error.message);
  }
};

const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in logoutUser: ", err.message);
  }
};

const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString())
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself" });

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in followUnFollowUser: ", err.message);
  }
};

const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req.body;
  let { profilePic } = req.body;

  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (req.params.id !== userId.toString())
      return res
        .status(400)
        .json({ error: "You cannot update other user's profile" });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();

    // Find all posts that this user replied and update username and userProfilePic fields
    await Post.updateMany(
      { "replies.userId": userId },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.profilePic,
        },
      },
      { arrayFilters: [{ "reply.userId": userId }] }
    );

    // password should be null in response
    user.password = null;

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in updateUser: ", err.message);
  }
};

// Start of integration code
const getSuggestedUsers = async (req, res) => {
  try {
    // exclude the current user from suggested users array and exclude users that current user is already following
    const userId = req.user._id;

    const usersFollowedByYou = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);
    const filteredUsers = users.filter(
      (user) => !usersFollowedByYou.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const freezeAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    user.isFrozen = true;
    await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// New function for awarding verification
const adminFreezeUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ error: "Cannot perform action on yourself" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.freezeCount >= 1) {
      user.isBanned = true;
      user.isFrozen = false;
      await user.save();

      // Send ban notification
      try {
        await transporter.sendMail({
          from: "pearnet104@gmail.com",
          to: user.email,
          subject: "Account Banned",
          text: "Your account has been banned. Unfortunately, until the foreseeable future, you will not be able to create an account with us again until further notice."
        });
      } catch (emailError) {
        console.error("Failed to send ban notification:", emailError);
      }

      await deleteUserData(userId);
      return res.json({ banned: true });
    }

    user.isFrozen = true;
    user.freezeCount += 1;
    user.freezeUntil = new Date(Date.now() + 14 * 86400000);
    await user.save();

    // Send freeze notification
    try {
      await transporter.sendMail({
        from: "pearnet104@gmail.com",
        to: user.email,
        subject: "Account Frozen",
        text: "You won't be able to access chat, commenting, and posting until you are unfrozen after 2 weeks."
      });
    } catch (emailError) {
      console.error("Failed to send freeze notification:", emailError);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const adminDeleteUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ error: "Cannot delete yourself" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Send ban notification
    try {
      await transporter.sendMail({
        from: "pearnet104@gmail.com",
        to: user.email,
        subject: "Account Banned",
        text: "Your account has been banned. Unfortunately, until the foreseeable future, you will not be able to create an account with us again until further notice."
      });
    } catch (emailError) {
      console.error("Failed to send ban notification:", emailError);
    }

    await deleteUserData(userId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add this helper function (implement actual deletion logic)
// userController.js
const deleteUserData = async (userId) => {
  try {
    // 1. Delete user's posts and associated data
    await Post.deleteMany({ user: userId });

    // 2. Remove user's replies from all posts
    await Post.updateMany(
      { "replies.userId": userId },
      { $pull: { replies: { userId: userId } } }
    );

    // 3. Handle conversations and messages
    const userConversations = await Conversation.find({
      participants: userId,
    });

    // Delete all messages in these conversations
    await Message.deleteMany({
      conversation: { $in: userConversations.map((c) => c._id) },
    });

    // Delete the conversations themselves
    await Conversation.deleteMany({
      participants: userId,
    });

    // 4. Remove user from social connections
    await User.updateMany(
      { $or: [{ followers: userId }, { following: userId }] },
      { $pull: { followers: userId, following: userId } }
    );

    // 5. Remove user from chat participants lists
    await Conversation.updateMany(
      { participants: userId },
      { $pull: { participants: userId } }
    );

    // 6. Delete profile picture from Cloudinary
    const user = await User.findById(userId);
    if (user?.profilePic) {
      const publicId = user.profilePic.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // 7. Finally delete the user document
    await User.findByIdAndDelete(userId);

    console.log(`Successfully deleted all data for user ${userId}`);
  } catch (error) {
    console.error("Error deleting user data:", error);
    throw error;
  }
};
const searchUsers = async (req, res) => {
  try {
    const { query } = req.params;
    const searchTerm = query.trim().toLowerCase();
    
    if (!searchTerm) {
      return res.status(400).json({ error: "Search query is required" });
    }
    
    // First try exact match
    let user = await User.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${searchTerm}$`, 'i') } },
        { email: { $regex: new RegExp(`^${searchTerm}$`, 'i') } }
      ]
    }).select("_id username email profilePic role");
    
    // If no exact match, try partial matches with additional sorting strategy
    if (!user) {
      // Find multiple users that partially match
      const users = await User.find({
        $or: [
          { username: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
          // For handling typos and misspellings, create array of similar patterns
          { username: { $regex: createFuzzyPattern(searchTerm), $options: "i" } },
          { email: { $regex: createFuzzyPattern(searchTerm), $options: "i" } }
        ]
      })
      .select("_id username email profilePic role lastActive")
      .limit(10); // Limit results for performance
      
      if (users.length === 0) {
        return res.status(404).json({ error: "No users found" });
      }
      
      // Sort results by relevance
      const sortedUsers = users.map(user => {
        const usernameScore = calculateRelevanceScore(user.username.toLowerCase(), searchTerm);
        const emailScore = calculateRelevanceScore(user.email.toLowerCase(), searchTerm);
        return {
          ...user._doc,
          relevanceScore: Math.max(usernameScore, emailScore)
        };
      }).sort((a, b) => b.relevanceScore - a.relevanceScore);
      
      // Return sorted results
      return res.status(200).json(sortedUsers.map(u => ({
        _id: u._id,
        username: u.username,
        profilePic: u.profilePic,
        role: u.role,
        // Include online status indicator based on lastActive
        isActive: u.lastActive ? Date.now() - new Date(u.lastActive) < 5 * 60 * 1000 : false,
      })));
    }
    
    // Single user found, return it
    res.status(200).json({
      _id: user._id,
      username: user.username,
      profilePic: user.profilePic,
      role: user.role,
      isActive: user.lastActive ? Date.now() - new Date(user.lastActive) < 5 * 60 * 1000 : false,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "An error occurred while searching for users" });
  }
};
const sendPasswordResetEmail = async (email, resetToken) => {
  const resetLink = `https://pear-tsk2.onrender.com/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: "pearnet104@gmail.com",
    to: email,
    subject: "Password Reset Request",
    text: `Click this link to reset your password: ${resetLink}\nThis link expires in 1 hour.`,
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 1 hour.</p>`
  };

  await transporter.sendMail(mailOptions);
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user doesn't exist
      return res.status(200).json({ message: "If an account exists, a reset email has been sent" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ error: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Add this to controllers/userController.js
const searchReviewers = async (req, res) => {
  try {
    const { query } = req.params;
    const searchTerm = query.trim().toLowerCase();
    
    if (!searchTerm) {
      return res.status(400).json({ error: "Search query is required" });
    }
    
    // Find reviewers (admin/teacher roles) with fuzzy matching
    const reviewers = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
            { name: { $regex: searchTerm, $options: "i" } },
            // Add fuzzy matching
            { username: { $regex: createFuzzyPattern(searchTerm), $options: "i" } },
            { email: { $regex: createFuzzyPattern(searchTerm), $options: "i" } },
            { name: { $regex: createFuzzyPattern(searchTerm), $options: "i" } }
          ]
        },
        { role: { $in: ["admin", "teacher"] } }
      ]
    })
    .select("_id username name profilePic role department")
    .limit(15);
    
    if (reviewers.length === 0) {
      return res.status(404).json({ error: "No reviewers found" });
    }
    
    // Sort by relevance
    const sortedReviewers = reviewers.map(reviewer => {
      const nameScore = reviewer.name ? calculateRelevanceScore(reviewer.name.toLowerCase(), searchTerm) : 0;
      const usernameScore = calculateRelevanceScore(reviewer.username.toLowerCase(), searchTerm);
      return {
        ...reviewer._doc,
        relevanceScore: Math.max(nameScore, usernameScore)
      };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    res.status(200).json(sortedReviewers.map(r => ({
      _id: r._id,
      username: r.username,
      name: r.name,
      profilePic: r.profilePic,
      role: r.role,
      department: r.department
    })));
  } catch (error) {
    console.error("Reviewer search error:", error);
    res.status(500).json({ error: "An error occurred while searching for reviewers" });
  }
};
const createFuzzyPattern = (term) => {
  // This creates a pattern that allows for:
  // - Character transpositions (e.g., "jahn" instead of "john")
  // - Missing characters (e.g., "joh" instead of "john")
  // - Extra characters (e.g., "johnn" instead of "john")
  
  // For simplicity, we'll create a pattern that matches:
  // - Words that contain the search term with one character different
  // - Words that start with the first character and contain most of the term
  
  if (term.length <= 2) {
    // For very short terms, just use the term itself
    return term;
  }
  
  // Build a pattern that's more forgiving for longer terms
  const firstChar = term.charAt(0);
  const middleChars = term.substring(1, term.length - 1).split('');
  
  // At least the first character must match, and most other characters
  let pattern = firstChar;
  
  // For each middle character, make it optional
  middleChars.forEach(char => {
    pattern += `[^${char}]?${char}?`;
  });
  
  // Last character is optional
  pattern += `.*`;
  
  return pattern;
};

// Helper function to calculate relevance score between two strings
const calculateRelevanceScore = (str, query) => {
  if (str === query) return 100; // Exact match
  if (str.startsWith(query)) return 90; // Starts with query
  if (str.includes(query)) return 80; // Contains query
  
  // Calculate Levenshtein distance (edit distance)
  const distance = levenshteinDistance(str, query);
  // Convert distance to a score (lower distance = higher score)
  return Math.max(0, 70 - (distance * 10));
};

// Implementation of Levenshtein distance for fuzzy matching
const levenshteinDistance = (str1, str2) => {
  const m = str1.length;
  const n = str2.length;
  
  // Create a matrix of size (m+1) x (n+1)
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  // Initialize first row and column
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  // Fill the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]; // No operation needed
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // deletion
          dp[i][j - 1],     // insertion
          dp[i - 1][j - 1]  // substitution
        );
      }
    }
  }
  
  return dp[m][n];
};

export {
  signupUser,
  forgotPassword,
  resetPassword,
  validateEmail,
  verifyRoleMatch,
  verifyOTP,
  resendOTP,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  getUserProfile,
  getSuggestedUsers,
  freezeAccount,
  adminFreezeUser,
  adminDeleteUser,
  deleteUserData,
  searchUsers,
  searchReviewers, // Exporting the new function
};