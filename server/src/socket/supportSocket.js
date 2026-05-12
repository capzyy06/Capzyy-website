import jwt from "jsonwebtoken";

import {
  Message,
  Conversation,
} from "../models/Support.js";

/**
 * Attach support socket logic to an existing Socket.IO server instance.
 *
 * Usage in server.js:
 *
 * import { Server } from "socket.io";
 * import supportSocket from "./socket/supportSocket.js";
 *
 * const io = new Server(httpServer, {
 *   cors: { origin: "*" },
 * });
 *
 * supportSocket(io);
 */

const supportSocket = (io) => {
  // Per-user message timestamps for server-side rate limiting
  const lastMessageTime = new Map(); // userId → timestamp

  const supportNs = io.of("/support");

  // ── Auth handshake ──────────────────────────────────────────────
  supportNs.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(
        new Error("Authentication required")
      );
    }

    try {
      socket.user = jwt.verify(
        token,
        process.env.JWT_SECRET
      ); // { id, role }

      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  supportNs.on("connection", (socket) => {
    const { id: userId, role } = socket.user;

    // ── Join room ─────────────────────────────────────────────────
    // Each user has a room named after their conversation ID.
    // Admin joins all rooms via "join_admin".

    socket.on(
      "join_conversation",
      (conversationId) => {
        socket.join(conversationId);
      }
    );

    socket.on("join_admin", () => {
      if (role !== "admin") return;

      socket.join("admin_room");
    });

    // ── Send message ──────────────────────────────────────────────
    socket.on(
      "send_message",

      async (
        { conversationId, text },
        ack
      ) => {
        try {
          if (!text?.trim()) {
            return ack?.({
              error: "Empty message",
            });
          }

          // Server-side rate limit:
          // 5 msgs / 60s for non-admins

          if (role !== "admin") {
            const now = Date.now();

            const history =
              lastMessageTime.get(userId) || [];

            const recent = history.filter(
              (t) => now - t < 60_000
            );

            if (recent.length >= 5) {
              return ack?.({
                error:
                  "Rate limit: too many messages",
              });
            }

            lastMessageTime.set(userId, [
              ...recent,
              now,
            ]);
          }

          const convo =
            await Conversation.findById(
              conversationId
            );

          if (!convo) {
            return ack?.({
              error: "Conversation not found",
            });
          }

          const isAdmin = role === "admin";

          if (
            !isAdmin &&
            convo.user.toString() !== userId
          ) {
            return ack?.({
              error: "Access denied",
            });
          }

          const message = await Message.create({
            conversation: conversationId,

            sender: userId,

            senderRole: isAdmin
              ? "admin"
              : "user",

            text: text.trim(),
          });

          await Conversation.findByIdAndUpdate(
            conversationId,
            {
              lastMessage: text
                .trim()
                .slice(0, 80),

              lastMessageAt: new Date(),

              $inc: isAdmin
                ? { unreadByUser: 1 }
                : { unreadByAdmin: 1 },
            }
          );

          // Broadcast to everyone
          // in the conversation room

          supportNs
            .to(conversationId)
            .emit("new_message", message);

          // Notify admin room
          // so the dashboard can update

          supportNs
            .to("admin_room")
            .emit("conversation_updated", {
              conversationId,

              lastMessage: text
                .trim()
                .slice(0, 80),

              lastMessageAt:
                message.createdAt,
            });

          ack?.({
            success: true,
            message,
          });
        } catch (err) {
          ack?.({
            error: "Server error",
          });
        }
      }
    );

    // ── Mark read ─────────────────────────────────────────────────
    socket.on(
      "mark_read",

      async ({ conversationId }) => {
        if (role !== "admin") return;

        await Conversation.findByIdAndUpdate(
          conversationId,
          {
            unreadByAdmin: 0,
          }
        );

        supportNs
          .to("admin_room")
          .emit("marked_read", {
            conversationId,
          });
      }
    );

    socket.on("disconnect", () => {
      // Cleanup rate-limit history
      // on disconnect (optional)

      lastMessageTime.delete(userId);
    });
  });
};

export default supportSocket;