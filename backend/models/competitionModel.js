import mongoose from "mongoose";

const competitionSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, default: false },
    devMode: { type: Boolean, default: true },
    halvedPoints: { type: Boolean, default: false },
    champion: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    endedAt: Date,
    endedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    lastReset: Date,
  },
  { timestamps: true }
);

const Competition = mongoose.model("Competition", competitionSchema);

export default Competition; 