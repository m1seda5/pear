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
    ref: "User"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add a pre-save middleware to validate members
groupSchema.pre('save', async function(next) {
  try {
    if (this.members && this.members.length > 0) {
      const validMembers = await User.find({ _id: { $in: this.members } });
      if (validMembers.length !== this.members.length) {
        throw new Error('Invalid user IDs in members array');
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Group = mongoose.model("Group", groupSchema);
export default Group;