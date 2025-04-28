import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, default: "" },
  content: { type: String, default: "" },
}, { timestamps: true });

const Note = mongoose.model("Note", noteSchema);
export default Note; 