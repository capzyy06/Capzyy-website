import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

// Reusable helper — throws a 400 if any validation rule failed
const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(e => e.msg).join(', '));
  }
};

// Validation rules for create / update
export const categoryValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ max: 100 }).withMessage('Name must be 100 characters or fewer')
    .escape(),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must be 1000 characters or fewer')
    .escape(),

  body('displayOrder')
    .optional()
    .isInt({ min: 0 }).withMessage('Display order must be a non-negative integer'),
];

// GET /api/v1/categories (public — active only)
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({
    isActive: true,
  }).sort({
    displayOrder: 1,
    name: 1,
  });

  res.json({ success: true, categories });
});

// GET /api/v1/categories/all (admin — includes inactive)
// BUG FIX: duplicate export of getAllCategories removed
export const getAllCategories = asyncHandler(async (req, res) => {
  
  const categories = await Category.find().sort({ displayOrder: 1 }); 
  res.json({ success: true, categories });

});

// GET /api/v1/categories/:slug
export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({
    slug: req.params.slug,
    isActive: true,
  });

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.json({ success: true, category });
});

// POST /api/v1/categories (Admin)
export const createCategory = asyncHandler(async (req, res) => {
  validate(req, res);

  const category = await Category.create(req.body);

  res.status(201).json({ success: true, category });
});

// PUT /api/v1/categories/:id (Admin)
export const updateCategory = asyncHandler(async (req, res) => {
  validate(req, res);

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.json({ success: true, category });
});

// DELETE /api/v1/categories/:id (Admin)
// BUG S-12 FIX: hard delete replaced with soft delete (isActive: false)
// to prevent orphaned product documents with dangling category references
export const deleteCategory = asyncHandler(async (req, res) => {
  const inUse = await Product.findOne({
    category: req.params.id,
    isActive: true,
  });

  if (inUse) {
    res.status(400);
    throw new Error('Category has active products. Remove them first.');
  }

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.json({ success: true, message: 'Category removed' });
});