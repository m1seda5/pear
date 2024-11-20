// this is the original
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


import mongoose from "mongoose";

const departmentEnum = [
  "Math", "Science", "English", "History", "Geography",
  "Art", "Music", "Physical Education", "ICT", "Other",
];

const yearGroupEnum = [
  "Year 7", "Year 8", "Year 9", "Year 10", 
  "Year 11", "Year 12", "Year 13",
];

const userSchema = mongoose.Schema(
  {
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
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    yearGroup: {
      type: String,
      enum: yearGroupEnum,
      required: function () {
        return this.role === "student";
      },
    },
    department: {
      type: String,
      enum: departmentEnum,
      required: function () {
        return this.role === "teacher";
      },
    },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
