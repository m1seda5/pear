// models/reviewerGroupModel.js
import mongoose from "mongoose";

const reviewerGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  permissions: {
    postReview: { type: Boolean, default: false }
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

const ReviewerGroup = mongoose.model("ReviewerGroup", reviewerGroupSchema);
export default ReviewerGroup;