import {
  Conversation,
  Message,
} from "../models/Support.js";

// ─── Get or create this user's conversation ───────────────────────
export const getOrCreateConversation = async (req, res) => {
  try {
    let convo = await Conversation.findOne({
      user: req.user._id,                          // ← _id
    }).populate("user", "name email");

    if (!convo) {
      convo = await Conversation.create({
        user: req.user._id,                        // ← _id
      });

      convo = await convo.populate("user", "name email");
    }

    res.json(convo);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// ─── Get messages for a conversation ─────────────────────────────
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Validate ownership or admin
    if (req.user.role !== "admin") {
      const convo = await Conversation.findById(conversationId);

      if (
        !convo ||
        convo.user.toString() !== req.user._id.toString()  // ← _id.toString()
      ) {
        return res.status(403).json({
          message: "Access denied",
        });
      }
    }

    const messages = await Message.find({
      conversation: conversationId,
    })
      .sort({ createdAt: 1 })
      .limit(100);

    res.json(messages);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// ─── Send a message ───────────────────────────────────────────────
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({
        message: "Empty message",
      });
    }

    const convo = await Conversation.findById(conversationId);

    if (!convo) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const isAdmin = req.user.role === "admin";

    if (
      !isAdmin &&
      convo.user.toString() !== req.user._id.toString()    // ← _id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,                                // ← _id
      senderRole: isAdmin ? "admin" : "user",
      text: text.trim(),
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text.trim().slice(0, 80),
      lastMessageAt: new Date(),
      $inc: isAdmin ? { unreadByUser: 1 } : { unreadByAdmin: 1 },
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// ─── Admin: get all conversations ────────────────────────────────
export const getAllConversations = async (req, res) => {
  try {
    const convos = await Conversation.find()
      .populate("user", "name email")
      .sort({ lastMessageAt: -1 });

    res.json(convos);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// ─── Mark conversation as read (admin) ───────────────────────────
export const markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;

    await Conversation.findByIdAndUpdate(conversationId, {
      unreadByAdmin: 0,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};