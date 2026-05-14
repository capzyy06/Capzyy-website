import express from 'express';

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats,
} from '../controllers/orderController.js';

import {
  protect,
  adminOnly,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// FIX: added protect middleware so only authenticated users can place orders.
// Previously this route had no auth at all — anyone (unauthenticated bots,
// scrapers, etc.) could POST to /orders and create junk records in the DB.
// If you intentionally want guest checkout, replace `protect` with a
// lightweight guest-or-user middleware instead of removing it entirely.
router.post('/', protect, createOrder);

router.get(
  '/',
  protect,
  adminOnly,
  getOrders
);

router.get(
  '/stats',
  protect,
  adminOnly,
  getOrderStats
);

router.get(
  '/:id',
  protect,
  adminOnly,
  getOrderById
);

router.put(
  '/:id/status',
  protect,
  adminOnly,
  updateOrderStatus
);

export default router;