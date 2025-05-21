// // this is the original(working)
// import mongoose from "mongoose";

// const userSchema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       minLength: 6,
//       required: true,
//     },
//     profilePic: {
//       type: String,
//       default: "",
//     },
//     followers: {
//       type: [String],
//       default: [],
//     },
//     following: {
//       type: [String],
//       default: [],
//     },
//     bio: {
//       type: String,
//       default: "",
//     },
//     isFrozen: {
//       type: Boolean,
//       default: false,
//     },
//     verification: {
//       type: String,
//       enum: ["none", "blue", "golden"], // Available verification options
//       default: "none", // Default to no verification
//     },
//     isStudent: {
//       type: Boolean,
//       default: false, // This field determines if the user is a student or not
//     },
//     yearGroup: {
//       type: String, // Store the selected year group
//       required: function () {
//         return this.isStudent; // yearGroup is only required if the user is a student
//       },
//     },
//     role: {
//       type: String,
//       enum: ["user", "teacher", "student"], // Include 'student' in the allowed roles
//       required: function () {
//         return this.isStudent || this.role === "teacher"; // Role is required for students and teachers
//       },
//       default: "user", // Default to 'user' if not provided
//     },
//   },
//   {
//     timestamps: true, // This will automatically add `createdAt` and `updatedAt` fields
//   }
// );

// const User = mongoose.model("User", userSchema);

// export default User;

// this is the admin role update
// import mongoose from "mongoose";

// const userSchema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       minLength: 6,
//       required: true,
//     },
//     isVerified: { type: Boolean, default: false },
//     verificationToken: { type: String, required: false },
//     profilePic: {
//       type: String,
//       default: "",
//     },
//     followers: {
//       type: [String],
//       default: [],
//     },
//     following: {
//       type: [String],
//       default: [],
//     },
//     bio: {
//       type: String,
//       default: "",
//     },
//     isFrozen: {
//       type: Boolean,
//       default: false,
//     },
//     verification: {
//       type: String,
//       enum: ["none", "blue", "golden"],
//       default: "none",
//     },
//     isStudent: {
//       type: Boolean,
//       default: false,
//     },
//     yearGroup: {
//       type: String,
//       enum: ["Year 9", "Year 10", "Year 11", "Year 12", "Year 13"],
//       required: function () {
//         return this.role === "student";
//       },
//     },
//     role: {
//       type: String,
//       enum: ["user", "teacher", "student", "admin", "tv"],
//       required: true,
//       default: "user",
//     },
//     department: {
//       type: String,
//       enum: [
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
//         "English",
//         "tv",
//       ],
//       required: function () {
//         return this.role === "teacher";
//       },
//     },

//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);
// export default User;

// email verfification update(working)
// import mongoose from "mongoose";

// const userSchema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       minLength: 6,
//       required: true,
//     },
//     isVerified: { type: Boolean, default: false },
//     verificationToken: { type: String, required: false },
//     profilePic: {
//       type: String,
//       default: "",
//     },
//     followers: {
//       type: [String],
//       default: [],
//     },
//     following: {
//       type: [String],
//       default: [],
//     },
//     bio: {
//       type: String,
//       default: "",
//     },
//     isFrozen: {
//       type: Boolean,
//       default: false,
//     },
//     isFrozen: {
//       type: Boolean,
//       default: false,
//     },
//     freezeCount: {
//       type: Number,
//       default: 0,
//     },
//     freezeUntil: {
//       type: Date,
//     },
//     isBanned: {
//       type: Boolean,
//       default: false,
//     },
//     verification: {
//       type: String,
//       enum: ["none", "blue", "golden"],
//       default: "none",
//     },
//     isStudent: {
//       type: Boolean,
//       default: false,
//     },
//     yearGroup: {
//       type: String,
//       enum: ["Year 9", "Year 10", "Year 11", "Year 12", "Year 13"],
//       required: function () {
//         return this.role === "student";
//       },
//     },
//     role: {
//       type: String,
//       enum: ["user", "teacher", "student", "admin", "tv"],
//       required: true,
//       default: "user",
//     },
//     department: {
//       type: String,
//       enum: [
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
//         "English",
//         "tv",
//       ],
//       required: function () {
//         return this.role === "teacher";
//       },
//     },
//     otp: { type: Number, required: false }, // Field for OTP
//     otpExpiry: { type: Date, required: false },
//     notificationPreferences: {
//       type: Boolean,
//       default: true, // Enable notifications by default
//     }, // Field for OTP expiration// Field for OTP expiration
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);
// export default User;

// validation update
import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    verificationToken: { 
      type: String, 
      required: false 
    },
    profilePic: {
      type: String,
      default: "",
    },
    followers: {
      type: [String],
      default: [],
    },
    following: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    isFrozen: {
      type: Boolean,
      default: false,
    },
    freezeCount: {
      type: Number,
      default: 0,
    },
    freezeUntil: {
      type: Date,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    isStudent: {
      type: Boolean,
      default: false,
    },
    yearGroup: {
      type: String,
      enum: ["Year 9", "Year 10", "Year 11", "Year 12", "Year 13"],
      required: function () {
        return this.role === "student";
      },
    },
    campus: {
      type: String,
      enum: ["karen", "runda", "admin"],
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "teacher", "student", "admin", "tv"],
      required: true,
      default: "user",
    },
    department: {
      type: String,
      enum: [
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Geography",
        "Computer Science",
        "Arts",
        "History",
        "Psychology",
        "Sociology",
        "Economics",
        "Business",
        "BTEC Business",
        "Physical Education",
        "BTEC Sport",
        "Music",
        "BTEC Music",
        "BTEC Art",
        "English",
        "tv",
      ],
      required: function () {
        return this.role === "teacher";
      },
    },
    otp: { 
      type: Number, 
      required: false 
    },
    otpExpiry: { 
      type: Date, 
      required: false 
    },
    notificationPreferences: {
      email: {
        type: Boolean,
        default: true
      },
      webPush: {
        type: Boolean,
        default: true
      }
    },
    resetToken: {
      type: String,
      required: false,
    },
    resetTokenExpiry: {
      type: Date,
      required: false,
    },
    lastActive: {
      type: Date, 
    }, // For online status tracking
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ], // New field for user groups
    reviewerGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ReviewerGroup",
      },
    ], // Field for reviewer groups
    lastNotificationDate: {
      type: Date,
      default: null
    },
    badges: [{ type: String }],
    lastBadge: { type: String, default: "wood" },
    outOfCompetition: { type: Boolean, default: false },
    devMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
