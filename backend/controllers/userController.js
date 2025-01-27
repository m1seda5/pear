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

// email verification update
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

const signupUser = async (req, res) => {
  console.log("Signup request received:", req.body);

  try {
    const bannedUser = await User.findOne({ email, isBanned: true });
    if (bannedUser) {
      return res
        .status(403)
        .json({ error: "This email is permanently banned" });
    }

    // In loginUser controller, add this check:
    if (user.isBanned) {
      return res.status(403).json({ error: "Account permanently banned" });
    }
    const { name, email, username, password, role, yearGroup, department } =
      req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 2 * 60 * 1000; // OTP valid for 2 minutes

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const unverifiedUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
      role, // Ensure role is saved
      isVerified: false,
      otp,
      otpExpiry,
      ...(role === "student" ? { yearGroup } : {}),
      ...(role === "teacher" ? { department } : {}),
    });

    await unverifiedUser.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({
      message: "OTP sent to email. Please verify within 2 minutes.",
      userId: unverifiedUser._id, // Send the userId for reference
    });
  } catch (err) {
    console.error("Error in signupUser:", err.message);
    res.status(500).json({
      error: "Failed to register user",
      details: err.message,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "User already verified" });
    }

    const receivedOTP = parseInt(otp, 10);

    if (user.otp !== receivedOTP) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({ error: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate token after verification
    generateTokenAndSetCookie(user._id, res);

    // Return complete user data including role, similar to original signup
    res.status(200).json({
      message: "User verified successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      yearGroup: user.yearGroup,
      department: user.department,
      isVerified: true,
    });
  } catch (err) {
    console.error("Verify OTP error:", err.message || err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const bannedUser = await User.findOne({ email, isBanned: true });
    if (bannedUser) {
      return res
        .status(403)
        .json({ error: "This email is permanently banned" });
    }

    // In loginUser controller, add this check:
    if (user.isBanned) {
      return res.status(403).json({ error: "Account permanently banned" });
    }
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    if (user.isFrozen) {
      user.isFrozen = false;
      await user.save();
    }

    // Start of auto-follow everyone code
    const allUsers = await User.find({});
    const allUserIds = allUsers.map((u) => u._id.toString());
    user.following = allUserIds;
    await user.save();
    // End of auto-follow everyone code

    // Send back the role to the front-end so it knows whether the user is a teacher or student
    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
      role: user.role, // Include the role in the response
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
const awardVerification = async (req, res) => {
  const { userId, verificationType } = req.body;

  // Validate verification type
  if (!["blue", "gold"].includes(verificationType)) {
    return res.status(400).json({ error: "Invalid verification type" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Set the verification type
    user.verification = verificationType;
    await user.save();

    res.status(200).json({ message: "Verification awarded", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in awardVerification: ", error.message);
  }
};
const adminFreezeUser = async (req, res) => {
  try {
    const { userId } = req.body;

    // Prevent self-freezing
    if (userId === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "Cannot perform action on yourself" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Handle automatic banning
    if (user.freezeCount >= 1) {
      user.isBanned = true;
      user.isFrozen = false;
      await user.save();
      await deleteUserData(userId); // Implement this function
      return res.json({ banned: true });
    }

    user.isFrozen = true;
    user.freezeCount += 1;
    user.freezeUntil = new Date(Date.now() + 14 * 86400000); // 14 days
    await user.save();

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
export {
  signupUser,
  verifyOTP,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  getUserProfile,
  getSuggestedUsers,
  freezeAccount,
  awardVerification,
  adminFreezerUser,
  adminDeleteUser,
  deleteUserData, // Exporting the new function
};
