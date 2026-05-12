import asyncHandler from 'express-async-handler';
import { body, query, param, validationResult } from 'express-validator';
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
export const productValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 200 }).withMessage('Name must be 200 characters or fewer'),

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

  // Validate features array
  body('features')
    .optional()
    .isArray().withMessage('Features must be an array'),

  body('features.*')
    .optional()
    .trim()
    .notEmpty().withMessage('Feature items cannot be empty')
    .isLength({ max: 200 }).withMessage('Each feature must be 200 characters or fewer')
    .escape(),

  // Sanitise any string fields that get stored and later rendered
  body('name').escape(),
  body('description').escape(),
];

// GET /api/v1/products
export const getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 12,
    search,
  } = req.query;

  const query = {
    isActive: true,
  };

  if (category) {
    query.category = category;
  }

  // BUG S-11 FIX: guard against NaN being silently added to the price query
  if (minPrice || maxPrice) {
    query.price = {};

    if (minPrice && isFinite(Number(minPrice))) {
      query.price.$gte = Number(minPrice);
    }

    if (maxPrice && isFinite(Number(maxPrice))) {
      query.price.$lte = Number(maxPrice);
    }

    // Drop the empty price object if neither guard passed
    if (!Object.keys(query.price).length) {
      delete query.price;
    }
  }

  if (search) {
    query.$text = { $search: search };
  }

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
  };

  const sortObj = sortMap[sort] || { createdAt: -1 };

  const total = await Product.countDocuments(query);

  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort(sortObj)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    products,
  });
});

// GET /api/v1/products/featured
export const getFeatured = asyncHandler(async (req, res) => {
  const products = await Product.find({
    isFeatured: true,
    isActive: true,
  })
    .populate('category', 'name slug')
    .limit(8);

  res.json({ success: true, products });
});

// GET /api/v1/products/new-arrivals
export const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({
    isNewArrival: true,
    isActive: true,
  })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(8);

  res.json({ success: true, products });
});

// GET /api/v1/products/bestsellers
export const getBestsellers = asyncHandler(async (req, res) => {
  const products = await Product.find({
    isBestSeller: true,
    isActive: true,
  })
    .populate('category', 'name slug')
    .limit(8);

  res.json({ success: true, products });
});

// GET /api/v1/products/:slug
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    isActive: true,
  }).populate('category', 'name slug');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, product });
});

// POST /api/v1/products (Admin)
// BUG S-7 FIX: apply productValidationRules in the route, validate here
export const createProduct = asyncHandler(async (req, res) => {
  validate(req, res);

  const product = await Product.create(req.body);
  await product.populate('category', 'name slug');

  res.status(201).json({ success: true, product });
});

// PUT /api/v1/products/:id (Admin)
export const updateProduct = asyncHandler(async (req, res) => {
  validate(req, res);

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

// DELETE /api/v1/products/:id (Admin - soft delete)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, message: 'Product removed' });
});

// GET /api/v1/products/admin/all (Admin - includes inactive)
export const adminGetAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;

  const query = {};

  if (search) {
    query.$text = { $search: search };
  }

  const total = await Product.countDocuments(query);

  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ success: true, total, products });
});

// GET /api/v1/products/admin/by-id/:id (Admin)
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, product });
});