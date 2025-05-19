import mongoose from "mongoose";

const gameAuditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    points: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
    ip: { type: String },
    requestId: { type: String },
    details: { type: Object }, // for extra info (e.g. badge, postId, etc)
  },
  { timestamps: true }
);

const GameAuditLog = mongoose.model("GameAuditLog", gameAuditLogSchema);

export default GameAuditLog; 