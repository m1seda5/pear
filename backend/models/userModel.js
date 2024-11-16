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

// Department options (you can add or remove as per your requirements)
const departmentEnum = [
  "Math",
  "Science",
  "English",
  "History",
  "Geography",
  "Art",
  "Music",
  "Physical Education",
  "ICT",
  "Other",
];

// Year groups (you can add/remove as needed)
const yearGroupEnum = [
  "Year 7",
  "Year 8",
  "Year 9",
  "Year 10",
  "Year 11",
  "Year 12",
  "Year 13",
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
      default: "student", // Default to "student" if role isn't provided
    },
    yearGroup: {
      type: String,
      enum: yearGroupEnum,
      required: function () {
        // Only require yearGroup if the user is a student
        return this.isStudent;
      },
    },
    department: {
      type: String,
      enum: departmentEnum,
      required: function () {
        // Only require department if the user is a teacher
        return this.isTeacher;
      },
    },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isStudent: {
      type: Boolean,
      default: true, // Assume new users are students unless specified otherwise
    },
    isTeacher: {
      type: Boolean,
      default: false, // Default to false unless specified otherwise
    },
    profilePic: {
      type: String, // URL to the user's profile picture
    },
  },
  {
    timestamps: true, // Include timestamps for created and updated times
  }
);

// Custom validation to ensure that either isStudent or isTeacher is true
userSchema.pre("save", function (next) {
  if (!this.isStudent && !this.isTeacher) {
    const error = new Error("At least one of isStudent or isTeacher must be true");
    return next(error);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;

