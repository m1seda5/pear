// this is the version one of postcontroller without the automatic follow update
// import Post from "../models/postModel.js";
// import User from "../models/userModel.js";
// import { v2 as cloudinary } from "cloudinary";

// const createPost = async (req, res) => {
// 	try {
// 		const { postedBy, text } = req.body;
// 		let { img } = req.body;

// 		if (!postedBy || !text) {
// 			return res.status(400).json({ error: "Postedby and text fields are required" });
// 		}

// 		const user = await User.findById(postedBy);
// 		if (!user) {
// 			return res.status(404).json({ error: "User not found" });
// 		}

// 		if (user._id.toString() !== req.user._id.toString()) {
// 			return res.status(401).json({ error: "Unauthorized to create post" });
// 		}

// 		const maxLength = 500;
// 		if (text.length > maxLength) {
// 			return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
// 		}

// 		if (img) {
// 			const uploadedResponse = await cloudinary.uploader.upload(img);
// 			img = uploadedResponse.secure_url;
// 		}

// 		const newPost = new Post({ postedBy, text, img });
// 		await newPost.save();

// 		res.status(201).json(newPost);
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 		console.log(err);
// 	}
// };

// const getPost = async (req, res) => {
// 	try {
// 		const post = await Post.findById(req.params.id);

// 		if (!post) {
// 			return res.status(404).json({ error: "Post not found" });
// 		}

// 		res.status(200).json(post);
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 	}
// };

// const deletePost = async (req, res) => {
// 	try {
// 		const post = await Post.findById(req.params.id);
// 		if (!post) {
// 			return res.status(404).json({ error: "Post not found" });
// 		}

// 		if (post.postedBy.toString() !== req.user._id.toString()) {
// 			return res.status(401).json({ error: "Unauthorized to delete post" });
// 		}

// 		if (post.img) {
// 			const imgId = post.img.split("/").pop().split(".")[0];
// 			await cloudinary.uploader.destroy(imgId);
// 		}

// 		await Post.findByIdAndDelete(req.params.id);

// 		res.status(200).json({ message: "Post deleted successfully" });
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 	}
// };

// const likeUnlikePost = async (req, res) => {
// 	try {
// 		const { id: postId } = req.params;
// 		const userId = req.user._id;

// 		const post = await Post.findById(postId);

// 		if (!post) {
// 			return res.status(404).json({ error: "Post not found" });
// 		}

// 		const userLikedPost = post.likes.includes(userId);

// 		if (userLikedPost) {
// 			// Unlike post
// 			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
// 			res.status(200).json({ message: "Post unliked successfully" });
// 		} else {
// 			// Like post
// 			post.likes.push(userId);
// 			await post.save();
// 			res.status(200).json({ message: "Post liked successfully" });
// 		}
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 	}
// };

// const replyToPost = async (req, res) => {
// 	try {
// 		const { text } = req.body;
// 		const postId = req.params.id;
// 		const userId = req.user._id;
// 		const userProfilePic = req.user.profilePic;
// 		const username = req.user.username;

// 		if (!text) {
// 			return res.status(400).json({ error: "Text field is required" });
// 		}

// 		const post = await Post.findById(postId);
// 		if (!post) {
// 			return res.status(404).json({ error: "Post not found" });
// 		}

// 		const reply = { userId, text, userProfilePic, username };

// 		post.replies.push(reply);
// 		await post.save();

// 		res.status(200).json(reply);
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 	}
// };

// const getFeedPosts = async (req, res) => {
// 	try {
// 		const userId = req.user._id;
// 		const user = await User.findById(userId);
// 		if (!user) {
// 			return res.status(404).json({ error: "User not found" });
// 		}

// 		const following = user.following;

// 		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

// 		res.status(200).json(feedPosts);
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 	}
// };

// const getUserPosts = async (req, res) => {
// 	const { username } = req.params;
// 	try {
// 		const user = await User.findOne({ username });
// 		if (!user) {
// 			return res.status(404).json({ error: "User not found" });
// 		}

// 		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

// 		res.status(200).json(posts);
// 	} catch (error) {
// 		res.status(500).json({ error: error.message });
// 	}
// };

// export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts };

// this is version working 
// import Post from "../models/postModel.js";
// import User from "../models/userModel.js";
// import { v2 as cloudinary } from "cloudinary";

// const createPost = async (req, res) => {
//   try {
//     const { postedBy, text } = req.body;
//     let { img } = req.body;

//     if (!postedBy || !text) {
//       return res
//         .status(400)
//         .json({ error: "Postedby and text fields are required" });
//     }

//     const user = await User.findById(postedBy);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     if (user._id.toString() !== req.user._id.toString()) {
//       return res.status(401).json({ error: "Unauthorized to create post" });
//     }

//     const maxLength = 500;
//     if (text.length > maxLength) {
//       return res
//         .status(400)
//         .json({ error: `Text must be less than ${maxLength} characters` });
//     }

//     if (img) {
//       const uploadedResponse = await cloudinary.uploader.upload(img);
//       img = uploadedResponse.secure_url;
//     }

//     const newPost = new Post({ postedBy, text, img });
//     await newPost.save();

//     res.status(201).json(newPost);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//     console.log(err);
//   }
// };

// const getPost = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);

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

// // --- Start of the integrated code ---
// const getFeedPosts = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Retrieve the list of users the current user is following
//     const following = user.following;

//     // Include the current user’s own ID in the list to fetch their posts as well
//     const allUserIds = [...following, userId];

//     // Fetch posts from all users in the list
//     const feedPosts = await Post.find({ postedBy: { $in: allUserIds } }).sort({
//       createdAt: -1,
//     });

//     res.status(200).json(feedPosts);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// // --- End of the integrated code ---

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

// version wiht repost 
// postController.js



// working
// import Post from "../models/postModel.js";
// import User from "../models/userModel.js";
// import { v2 as cloudinary } from "cloudinary";

// const createPost = async (req, res) => {
//   try {
//     const { postedBy, text } = req.body;
//     let { img } = req.body;

//     if (!postedBy || !text) {
//       return res
//         .status(400)
//         .json({ error: "Postedby and text fields are required" });
//     }

//     const user = await User.findById(postedBy);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     if (user._id.toString() !== req.user._id.toString()) {
//       return res.status(401).json({ error: "Unauthorized to create post" });
//     }

//     const maxLength = 500;
//     if (text.length > maxLength) {
//       return res
//         .status(400)
//         .json({ error: `Text must be less than ${maxLength} characters` });
//     }

//     if (img) {
//       const uploadedResponse = await cloudinary.uploader.upload(img);
//       img = uploadedResponse.secure_url;
//     }

//     const newPost = new Post({ postedBy, text, img });
//     await newPost.save();

//     res.status(201).json(newPost);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//     console.log(err);
//   }
// };

// const getPost = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);

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
//     const userId = req.user._id;
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Retrieve the list of users the current user is following
//     const following = user.following;

//     // Include the current user’s own ID in the list to fetch their posts as well
//     const allUserIds = [...following, userId];

//     // Fetch posts from all users in the list
//     const feedPosts = await Post.find({ postedBy: { $in: allUserIds } }).sort({
//       createdAt: -1,
//     });

//     res.status(200).json(feedPosts);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
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



// version with the addtion of roles 
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
  try {
    const { postedBy, text, targetAudience } = req.body;
    let { img } = req.body;

    if (!postedBy || !text) {
      return res.status(400).json({ error: "PostedBy and text fields are required" });
    }

    // Find the user who is posting
    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is authorized to post
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to create post" });
    }

    // Ensure text length is within limit (500 characters max)
    if (text.length > 500) {
      return res.status(400).json({ error: `Text must be less than 500 characters` });
    }

    // Handle image upload if provided
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    // Only teachers can set the `targetAudience`
    let finalTargetAudience = null;
    if (user.role === "teacher") {
      finalTargetAudience = targetAudience || 'all';  // Default to 'all' if not specified
    }

    // Create the new post
    const newPost = new Post({
      postedBy,
      text,
      img,
      targetAudience: finalTargetAudience,  // Target audience only for teachers
    });

    // Save the post
    await newPost.save();

    // Respond with the newly created post
    res.status(201).json(newPost);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// previous verion  with a few buggs

// const getPost = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const user = req.user; // Assume the user is extracted from the request

//     // Fetch the post with the targetAudience
//     const post = await Post.findById(postId).populate("postedBy", "username profilePic");

//     if (!post) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     const userEmail = user.email;
//     const isTeacher = !userEmail.includes("students");

//     // Teachers can view any post, or any post meant for "all"
//     if (isTeacher) {
//       if (post.targetAudience && post.targetAudience !== "all") {
//         return res.status(403).json({ error: "Unauthorized access to this post" });
//       }
//     } else {
//       // Students can only view posts meant for their year group or "all"
//       if (post.targetAudience !== "all" && post.targetAudience !== user.yearGroup) {
//         return res.status(403).json({ error: "Unauthorized access to this post" });
//       }
//     }

//     // If all checks pass, return the post
//     res.status(200).json(post);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const getPost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Fetch the post with the postedBy details
    const post = await Post.findById(postId).populate("postedBy", "username profilePic");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Return the post since the middleware has already filtered access
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
    const userId = req.user && req.user._id; // Ensure req.user exists before accessing userId

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized, user not authenticated" });
    }

    const user = await User.findById(userId).select("role following yearGroup isStudent");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Retrieve the list of users the current user is following
    const following = user.following || [];

    // Include the current user’s own ID in the list to fetch their posts as well
    const allUserIds = [...following, userId];

    // Fetch posts based on target audience and user roles
    const feedPosts = await Post.find({
      $or: [
        { targetAudience: null }, // Posts without specific targeting (public)
        { targetAudience: "all" }, // Posts targeted to all users
        { targetAudience: user.isStudent ? user.yearGroup : user.role }, // Posts targeted to user's year group or role
        { postedBy: { $in: allUserIds } }, // Posts by users the current user is following
      ],
    }).sort({ createdAt: -1 });

    // If no posts found, return an empty array instead of 404
    if (!feedPosts.length) {
      return res.status(200).json([]);
    }

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
