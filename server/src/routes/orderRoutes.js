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

router.post('/', createOrder);

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