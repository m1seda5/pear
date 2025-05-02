import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }],
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      required: function() {
        return this.isGroup === true;
      }
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function() {
        return this.isGroup === true;
      }
    },
    groupMembersLimit: {
      type: Number,
      default: 30,
      max: 100,
    },
    lastMessage: {
      text: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      seen: {
        type: Boolean,
        default: false,
      }
    },
    monitored: {
      type: Boolean,
      default: false,
    },
    isCommunity: {
      type: Boolean,
      default: false,
    },
    groupAvatar: {
      type: String,
      default: '',
    }
  },
  { timestamps: true }
);

// Add a pre-save middleware to validate participants
conversationSchema.pre('save', function(next) {
  if (this.isGroup && this.participants.length < 2) {
    next(new Error('Group conversations must have at least 2 participants'));
  } else if (!this.isGroup && this.participants.length !== 2) {
    next(new Error('Direct conversations must have exactly 2 participants'));
  } else {
    next();
  }
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
