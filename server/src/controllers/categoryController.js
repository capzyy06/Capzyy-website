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
// FIX: removed .escape() from name and description.
// .escape() HTML-encodes values in req.body (e.g. "Caps & Hats" → "Caps &amp; Hats")
// before the controller runs, so that corrupted string gets saved to MongoDB.
// Data is stored in the DB — not rendered as raw HTML — so escaping is wrong here.
export const categoryValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ max: 100 }).withMessage('Name must be 100 characters or fewer'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must be 1000 characters or fewer'),

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

// GET /api/v1/categories/admin/all (admin — includes inactive)
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
// FIX: reads req.file (populated by multer/Cloudinary via categoryRoutes)
// and merges the image url+publicId into the document.
// Previously used Category.create(req.body) which ignored the uploaded file
// entirely, and req.body was also empty because multipart/form-data is not
// parsed by express.json() / express.urlencoded().
export const createCategory = asyncHandler(async (req, res) => {
  validate(req, res);

  const imageData = req.file
    ? { url: req.file.path, publicId: req.file.filename }
    : {};

  const category = await Category.create({
    name: req.body.name,
    description: req.body.description || '',
    displayOrder: req.body.displayOrder || 0,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    image: imageData,
  });

  res.status(201).json({ success: true, category });
});

// PUT /api/v1/categories/:id (Admin)
// FIX 1: use category.save() instead of findByIdAndUpdate so that the
// pre('save') hook in Category.js fires and regenerates the slug when
// the name changes. findByIdAndUpdate bypasses all Mongoose middleware.
// FIX 2: handles req.file for image replacement.
export const updateCategory = asyncHandler(async (req, res) => {
  validate(req, res);

  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Apply scalar field updates
  if (req.body.name       !== undefined) category.name        = req.body.name;
  if (req.body.description !== undefined) category.description = req.body.description;
  if (req.body.displayOrder !== undefined) category.displayOrder = Number(req.body.displayOrder);
  if (req.body.isActive   !== undefined) category.isActive    = req.body.isActive === 'true' || req.body.isActive === true;

  // Replace image only when a new file was uploaded
  if (req.file) {
    category.image = { url: req.file.path, publicId: req.file.filename };
  }

  // save() triggers pre('save') → slug auto-regenerates if name changed
  await category.save();

  res.json({ success: true, category });
});

// DELETE /api/v1/categories/:id (Admin)
// Soft-delete: sets isActive:false to avoid orphaned product references.
// DELETE /api/v1/categories/:id (Admin)
export const deleteCategory = asyncHandler(async (req, res) => {
  const inUse = await Product.findOne({
    category: req.params.id,
    isActive: true,
  });

  if (inUse) {
    res.status(400);
    throw new Error('Category has active products. Remove them first.');
  }

  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.json({ success: true, message: 'Category deleted' });
});