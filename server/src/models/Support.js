import mongoose from "mongoose";

// ─── Message Schema ───────────────────────────────────────────────
const MessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    senderRole: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

// ─── Conversation Schema ──────────────────────────────────────────
const ConversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one conversation per user
    },

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },

    unreadByAdmin: {
      type: Number,
      default: 0,
    },

    unreadByUser: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", MessageSchema);

export const Conversation = mongoose.model(
  "Conversation",
  ConversationSchema
);