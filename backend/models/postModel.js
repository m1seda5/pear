//this is the normal verion without admin role added
import mongoose from "mongoose";

const postSchema = mongoose.Schema(
	{
	  postedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	  },
	  text: {
		type: String,
		maxLength: 500,
	  },
	  img: {
		type: String,
	  },
	  likes: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: "User",
		default: [],
	  },
	  replies: [
		{
		  userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		  },
		  text: {
			type: String,
			required: true,
		  },
		  userProfilePic: {
			type: String,
		  },
		  username: {
			type: String,
		  },
		},
	  ],
		// other fields...
		targetAudience: {
		  type: String,
		  enum: ['all', 'Year 12', 'Year 13', null], // Add null if you want to allow it
		  default: null, // Optionally set a default value
		},
	},
	{
	  timestamps: true,
	}
  );
  

const Post = mongoose.model("Post", postSchema);

export default Post;


// this is the version with admin role added
// import mongoose from "mongoose";

// const postSchema = mongoose.Schema(
//   {
//     postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     text: { type: String, maxLength: 500 },
//     img: { type: String },
//     likes: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
//     replies: [
//       {
//         userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//         text: { type: String, required: true },
//         userProfilePic: { type: String },
//         username: { type: String },
//       },
//     ],
//     targetAudience: {
//       type: String,
//       enum: ["all", "Year 9", "Year 10", "Year 11", "Year 12", "Year 13", "teachers", null],
//       default: null,
//     },
//   },
//   { timestamps: true }
// );

// const Post = mongoose.model("Post", postSchema);
// export default Post;
