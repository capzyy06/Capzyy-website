import express from 'express';

import {
  getProducts,
  getFeatured,
  getNewArrivals,
  getBestsellers,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adminGetAllProducts,
  productValidationRules,
} from '../controllers/productController.js';

import {
  protect,
  adminOnly,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── Public routes ────────────────────────────────────────────
router.get('/', getProducts);

router.get('/featured', getFeatured);

router.get('/new-arrivals', getNewArrivals);

router.get('/bestsellers', getBestsellers);

// ─── Admin routes ─────────────────────────────────────────────
// IMPORTANT: all /admin/* routes MUST be before /:slug
router.get('/admin/all', protect, adminOnly, adminGetAllProducts);

// BUG C-3 FIX: dedicated by-id endpoint so AdminProductForm doesn't
// have to scan all products and client-side find() by _id
router.get('/admin/by-id/:id', protect, adminOnly, getProductById);

// ─── Param routes ─────────────────────────────────────────────
router.get('/:slug', getProductBySlug);

// ─── Admin mutations ──────────────────────────────────────────
router.post('/', protect, adminOnly, productValidationRules, createProduct);

router.put('/:id', protect, adminOnly, productValidationRules, updateProduct);

router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;