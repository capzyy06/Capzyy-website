import express from 'express';

import {
  createPaymentOrder,
  verifyPayment,
  handleWebhook,
} from '../controllers/paymentController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── POST /api/v1/payments/create-order ────────────────────────────
// Protected — only logged-in users can initiate payment
// Called after the Capzyy order is created in DB
router.post('/create-order', protect, createPaymentOrder);

// ── POST /api/v1/payments/verify ──────────────────────────────────
// Protected — confirms payment status with Cashfree after redirect
// Frontend calls this on the order-confirmation page
router.post('/verify', protect, verifyPayment);

// ── POST /api/v1/payments/webhook ─────────────────────────────────
// PUBLIC — Cashfree calls this server-to-server (no cookie/auth)
// Signature is verified inside the controller using Cashfree SDK
router.post('/webhook', handleWebhook);

export default router;