import mongoose from "mongoose";

const dailyQuestionSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // e.g. '2024-06-01'
    question: { type: String, required: true },
    options: [{ type: String, required: true }], // Array of possible answers
    answer: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    correctUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // first 25
    isActive: { type: Boolean, default: true }, // whether this question is currently active
    used: { type: Boolean, default: false }, // whether this question has been used
  },
  { timestamps: true }
);

// Index for efficient querying
dailyQuestionSchema.index({ date: 1, isActive: 1 });

const DailyQuestion = mongoose.model("DailyQuestion", dailyQuestionSchema);

export default DailyQuestion; 