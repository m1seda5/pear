import mongoose from "mongoose";
import User from "./userModel.js"; // Make sure to import your User model

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    unique: true
  },
  description: String,
  color: {
    type: String,
    required: true,
    default: "#4CAF50"
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    validate: {
      validator: async function(members) {
        const users = await User.find({ _id: { $in: members } });
        return users.length === members.length;
      },
      message: "Invalid user IDs in members array"
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Group = mongoose.model("Group", groupSchema);
export default Group;