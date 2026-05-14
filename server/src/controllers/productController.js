import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

// ── Reusable validation helper ────────────────────────────────────────────────
const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map((e) => e.msg).join(', '));
  }
};

// ── Validation rules for create / update ─────────────────────────────────────
// FIX: removed body('name').escape() and body('description').escape()
// .escape() HTML-encodes characters — "Men's Cap" becomes "Men&#x27;s Cap"
// stored literally in MongoDB and rendered raw in the UI.
// React escapes output by default, so XSS protection is already handled
// at render time. .trim() and length limits are sufficient here.
export const productValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 200 }).withMessage('Name must be 200 characters or fewer'),
    // ← NO .escape() here — would corrupt "Men's Cap" → "Men&#x27;s Cap"

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Category must be a valid ID'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description must be 5000 characters or fewer'),
    // ← NO .escape() — description may contain intentional punctuation/symbols

  body('features')
    .optional()
    .isArray().withMessage('Features must be an array'),

  body('features.*')
    .optional()
    .trim()
    .notEmpty().withMessage('Feature items cannot be empty')
    .isLength({ max: 200 }).withMessage('Each feature must be 200 characters or fewer'),
    // ← .escape() removed from features too — same corruption risk
];

// ── GET /api/v1/products ──────────────────────────────────────────────────────
export const getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    minPrice,
    maxPrice,
    sort,
    page  = 1,
    limit = 12,
    search,
  } = req.query;

  const filter = { isActive: true };

  if (category) {
    // FIX: validate that category is a valid ObjectId before querying
    // passing a non-ObjectId string throws a CastError and crashes
    if (!mongoose.isValidObjectId(category)) {
      res.status(400);
      throw new Error('Invalid category ID');
    }
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice && isFinite(Number(minPrice))) filter.price.$gte = Number(minPrice);
    if (maxPrice && isFinite(Number(maxPrice))) filter.price.$lte = Number(maxPrice);
    if (!Object.keys(filter.price).length) delete filter.price;
  }

  if (search) {
    // FIX: $text requires the text index — safe, no ReDoS risk
    // Trim + cap length to prevent oversized search queries
    const safeSearch = search.trim().slice(0, 100);
    if (safeSearch) filter.$text = { $search: safeSearch };
  }

  const sortMap = {
    newest:       { createdAt: -1 },
    oldest:       { createdAt:  1 },
    'price-asc':  { price:  1 },
    'price-desc': { price: -1 },
  };

  const sortObj   = sortMap[sort] || { createdAt: -1 };
  const pageNum   = Math.max(1, Number(page));
  const limitNum  = Math.min(50, Math.max(1, Number(limit))); // cap at 50

  const [total, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortObj)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
  ]);

  res.json({
    success: true,
    total,
    page:  pageNum,
    pages: Math.ceil(total / limitNum),
    products,
  });
});

// ── GET /api/v1/products/featured ─────────────────────────────────────────────
export const getFeatured = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(8);

  res.json({ success: true, products });
});

// ── GET /api/v1/products/new-arrivals ─────────────────────────────────────────
export const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({ isNewArrival: true, isActive: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(8);

  res.json({ success: true, products });
});

// ── GET /api/v1/products/bestsellers ──────────────────────────────────────────
export const getBestsellers = asyncHandler(async (req, res) => {
  const products = await Product.find({ isBestSeller: true, isActive: true })
    .populate('category', 'name slug')
    .limit(8);

  res.json({ success: true, products });
});

// ── GET /api/v1/products/:slug ────────────────────────────────────────────────
export const getProductBySlug = asyncHandler(async (req, res) => {
  // FIX: sanitise slug — only allow lowercase letters, numbers, hyphens
  // malformed slugs could cause unexpected DB behaviour
  const slug = req.params.slug.toLowerCase().replace(/[^a-z0-9-]/g, '');

  if (!slug) {
    res.status(400);
    throw new Error('Invalid product slug');
  }

  const product = await Product.findOne({ slug, isActive: true })
    .populate('category', 'name slug');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, product });
});

// ── POST /api/v1/products  (Admin) ────────────────────────────────────────────
export const createProduct = asyncHandler(async (req, res) => {
  validate(req, res);

  const product = await Product.create(req.body);
  await product.populate('category', 'name slug');

  res.status(201).json({ success: true, product });
});

// ── PUT /api/v1/products/:id  (Admin) ─────────────────────────────────────────
export const updateProduct = asyncHandler(async (req, res) => {
  validate(req, res);

  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid product ID');
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('category', 'name slug');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, product });
});

// ── DELETE /api/v1/products/:id  (Admin — soft delete) ────────────────────────
// ── DELETE /api/v1/products/:id  (Admin — hard delete) ────────────────────────
export const deleteProduct = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid product ID');
  }

  // ❌ Remove this
  // const product = await Product.findByIdAndUpdate(
  //   req.params.id,
  //   { isActive: false },
  //   { new: true }
  // );

  // ✅ Replace with this
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, message: 'Product deleted' });
});


// ── GET /api/v1/products/admin/all  (Admin — includes inactive) ───────────────
export const adminGetAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;

  const filter = {};

  if (search) {
    const safeSearch = search.trim().slice(0, 100);
    if (safeSearch) filter.$text = { $search: safeSearch };
  }

  const pageNum  = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  const [total, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
  ]);

  res.json({
    success: true,
    total,
    page:  pageNum,
    pages: Math.ceil(total / limitNum),
    products,
  });
});

// ── GET /api/v1/products/admin/by-id/:id  (Admin) ─────────────────────────────
export const getProductById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid product ID');
  }

  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, product });
});