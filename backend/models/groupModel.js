import mongoose from "mongoose";
import User from "./userModel.js";

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
    ref: "User"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Removed the pre-save validation hook

const Group = mongoose.model("Group", groupSchema);
export default Group;