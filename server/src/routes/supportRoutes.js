// supportRoutes.js
import express from "express";
import * as ctrl from "../controllers/supportController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";  // ← your existing one
import rateLimit from "express-rate-limit";

const router = express.Router();

const supportRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: { message: "Too many messages. Please wait a moment." },
  standardHeaders: true,
  legacyHeaders: false,
});

// User routes
router.get("/conversation", protect, ctrl.getOrCreateConversation);
router.get("/messages/:conversationId", protect, ctrl.getMessages);
router.post("/messages", protect, supportRateLimit, ctrl.sendMessage);

// Admin routes
router.get("/admin/conversations", protect, adminOnly, ctrl.getAllConversations);
router.patch("/admin/read/:conversationId", protect, adminOnly, ctrl.markAsRead);

export default router;