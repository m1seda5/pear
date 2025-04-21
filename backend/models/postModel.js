// //this is the original (working)
// import mongoose from "mongoose";

// const postSchema = mongoose.Schema(
// 	{
// 	  postedBy: {
// 		type: mongoose.Schema.Types.ObjectId,
// 		ref: "User",
// 		required: true,
// 	  },
// 	  text: {
// 		type: String,
// 		maxLength: 500,
// 	  },
// 	  img: {
// 		type: String,
// 	  },
// 	  likes: {
// 		type: [mongoose.Schema.Types.ObjectId],
// 		ref: "User",
// 		default: [],
// 	  },
// 	  replies: [
// 		{
// 		  userId: {
// 			type: mongoose.Schema.Types.ObjectId,
// 			ref: "User",
// 			required: true,
// 		  },
// 		  text: {
// 			type: String,
// 			required: true,
// 		  },
// 		  userProfilePic: {
// 			type: String,
// 		  },
// 		  username: {
// 			type: String,
// 		  },
// 		},
// 	  ],
// 		// other fields...
// 		targetAudience: {
// 		  type: String,
// 		  enum: ['all', 'Year 12', 'Year 13', null], // Add null if you want to allow it
// 		  default: null, // Optionally set a default value
// 		},
// 	},
// 	{
// 	  timestamps: true,
// 	}
//   );

// const Post = mongoose.model("Post", postSchema);

// export default Post;

// this is the admin role update(working)
// import mongoose from "mongoose";

// const postSchema = mongoose.Schema(
//   {
//     postedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     text: {
//       type: String,
//       maxLength: 500,
//     },
//     img: {
//       type: String,
//     },
//     likes: {
//       type: [mongoose.Schema.Types.ObjectId],
//       ref: "User",
//       default: [],
//     },
//     replies: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//           required: true,
//         },
//         text: {
//           type: String,
//           required: true,
//         },
//         userProfilePic: {
//           type: String,
//         },
//         username: {
//           type: String,
//         },
//       },
//     ],
//     // Target audience for students and teachers
//     targetAudience: {
//       type: String,
//       enum: [
//         "all",
//         "Year 9",
//         "Year 10",
//         "Year 11",
//         "Year 12",
//         "Year 13",
//         "Mathematics",
//         "Physics",
//         "Chemistry",
//         "Biology",
//         "Geography",
//         "Computer Science",
//         "Arts",
//         "History",
//         "Psychology",
//         "Sociology",
//         "Economics",
//         "Business",
//         "BTEC Business",
//         "Physical Education",
//         "BTEC Sport",
//         "Music",
//         "BTEC Music",
//         "BTEC Art",
//         "Englich",
//         "tv",
//       ],
//       default: "all",
//     },
//     // Specific year groups for targeting
//     targetYearGroups: {
//       type: [String], // Array to support multiple year groups
//       default: [], // Default is an empty array
//     },
//     // Specific departments for targeting
//     targetDepartments: {
//       type: [String], // Array to support multiple departments
//       default: [], // Default is an empty array
//     },
//   },
//   {
//     timestamps: true,
//   }
// );
// const Post = mongoose.model("Post", postSchema);

// export default Post;


// post review
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
    targetAudience: {
      type: String,
      enum: [
        "all", "Year 9", "Year 10", "Year 11", "Year 12", "Year 13",
        "Mathematics", "Physics", "Chemistry", "Biology", "Geography",
        "Computer Science", "Arts", "History", "Psychology", "Sociology",
        "Economics", "Business", "BTEC Business", "Physical Education",
        "BTEC Sport", "Music", "BTEC Music", "BTEC Art", "Englich", "tv"
      ],
      default: "all",
    },
    targetYearGroups: {
      type: [String],
      default: [],
    },
    targetDepartments: {
      type: [String],
      default: [],
    },
    reviewStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    reviewers: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      role: {
        type: String,
        enum: ["admin", "teacher", "student"]
      },
      decision: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
      },
      reviewedAt: Date
    }],
    reviewedBy: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      decision: String,
      decisionDate: Date
    }],
    reposts: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }],
      default: []
    },
    targetGroups: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group"
    }],
    isGeneral: {
      type: Boolean,
      default: false
    },
    views: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }],
      default: []
    },
    viewCount: {
      type: Number,
      default: 0,
      get: function() {
        return this.views.length;
      }
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Enable virtuals in JSON output
    toObject: { virtuals: true } // Enable virtuals in object output
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;