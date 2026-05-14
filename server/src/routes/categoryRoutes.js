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

import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.get('/', getCategories);

router.get(
  '/admin/all',
  protect,
  adminOnly,
  getAllCategories
);

router.get('/:slug', getCategoryBySlug);

// FIX: added upload.single('image') so multer parses multipart/form-data
// and populates req.file (Cloudinary upload) + req.body fields.
// Without this, req.body is empty when the frontend sends FormData,
// causing validation to fail and the image to be silently dropped.
router.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  categoryValidationRules,
  createCategory
);

// FIX: same upload middleware needed on PUT so image replacement works.
router.put(
  '/:id',
  protect,
  adminOnly,
  upload.single('image'),
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