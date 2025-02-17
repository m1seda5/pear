import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupName: String,
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    groupMembersLimit: {
      type: Number,
      default: 30,
      max: 100,
    },
    auditLog: [
      {
        action: {
          type: String,
          enum: [
            "CREATE",
            "UPDATE",
            "ADD_MEMBER",
            "REMOVE_MEMBER",
            "CHANGE_ADMIN",
          ],
          required: true,
        },
        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        details: mongoose.Schema.Types.Mixed,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ], // Absolute maximum for safety
    lastMessage: {
      text: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      seen: {
        type: Boolean,
        default: false,
      },
    },
    monitored: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
