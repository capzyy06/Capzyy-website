import express from 'express';

import {
  getCategories,
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  categoryValidationRules,
} from '../controllers/categoryController.js';

import {
  protect,
  adminOnly,
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCategories);

router.get(
  '/admin/all',
  protect,
  adminOnly,
  getAllCategories
);

router.get('/:slug', getCategoryBySlug);

router.post(
  '/',
  protect,
  adminOnly,
  categoryValidationRules,
  createCategory
);

router.put(
  '/:id',
  protect,
  adminOnly,
  categoryValidationRules,
  updateCategory
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  deleteCategory
);

export default router;