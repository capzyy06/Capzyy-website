import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import HeroBanner from '../models/HeroBanner.js';

// ── Helpers ───────────────────────────────────────────────────

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(e => e.msg).join(', '));
  }
};

/**
 * Get or create the singleton HeroBanner document.
 * There is only ever ONE doc in the collection.
 */
const getBannerDoc = async () => {
  let banner = await HeroBanner.findOne();
  if (!banner) banner = await HeroBanner.create({ slides: [] });
  return banner;
};

// ── Validation rules ──────────────────────────────────────────

export const slideValidationRules = [
  body('image.url').notEmpty().withMessage('Slide image URL is required'),
  body('image.publicId').notEmpty().withMessage('Slide image publicId is required'),

  body('eyebrow').optional().trim().isLength({ max: 80 }).withMessage('Eyebrow max 80 chars'),
  body('headline').optional().trim().isLength({ max: 120 }).withMessage('Headline max 120 chars'),
  body('subHeadline').optional().trim().isLength({ max: 120 }).withMessage('Sub-headline max 120 chars'),
  body('bodyText').optional().trim().isLength({ max: 300 }).withMessage('Body text max 300 chars'),

  body('primaryBtnLabel').optional().isLength({ max: 40 }).withMessage('Button label max 40 chars'),
  body('secondaryBtnLabel').optional().isLength({ max: 40 }).withMessage('Button label max 40 chars'),

  body('primaryBtnLink').optional().trim(),
  body('secondaryBtnLink').optional().trim(),

  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  body('order').optional().isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),
];

// ── PUBLIC ────────────────────────────────────────────────────

/**
 * GET /api/v1/hero-banner
 * Returns only active slides, sorted by order.
 */
export const getHeroBanner = asyncHandler(async (req, res) => {
  const banner = await getBannerDoc();

  const activeSlides = banner.slides
    .filter(s => s.isActive)
    .sort((a, b) => a.order - b.order);

  res.json({
    success: true,
    slideDuration: banner.slideDuration,
    slides: activeSlides,
  });
});

// ── ADMIN ─────────────────────────────────────────────────────

/**
 * GET /api/v1/hero-banner/admin
 * Returns ALL slides (including inactive) for admin management.
 */
export const adminGetHeroBanner = asyncHandler(async (req, res) => {
  const banner = await getBannerDoc();

  const slides = [...banner.slides].sort((a, b) => a.order - b.order);

  res.json({
    success: true,
    _id: banner._id,
    slideDuration: banner.slideDuration,
    slides,
  });
});

/**
 * POST /api/v1/hero-banner/slides
 * Add a new slide.
 */
export const addSlide = asyncHandler(async (req, res) => {
  validate(req, res);

  const banner = await getBannerDoc();

  // Auto-assign order as last position
  const maxOrder = banner.slides.reduce((m, s) => Math.max(m, s.order), -1);

  banner.slides.push({
    ...req.body,
    order: req.body.order ?? maxOrder + 1,
  });

  await banner.save();

  const added = banner.slides[banner.slides.length - 1];
  res.status(201).json({ success: true, slide: added });
});

/**
 * PUT /api/v1/hero-banner/slides/:slideId
 * Update a single slide by its _id.
 */
export const updateSlide = asyncHandler(async (req, res) => {
  validate(req, res);

  const banner = await getBannerDoc();

  const slide = banner.slides.id(req.params.slideId);
  if (!slide) {
    res.status(404);
    throw new Error('Slide not found');
  }

  // Merge fields — only overwrite what was sent
  Object.assign(slide, req.body);

  await banner.save();
  res.json({ success: true, slide });
});

/**
 * DELETE /api/v1/hero-banner/slides/:slideId
 * Remove a slide.
 */
export const deleteSlide = asyncHandler(async (req, res) => {
  const banner = await getBannerDoc();

  const slide = banner.slides.id(req.params.slideId);
  if (!slide) {
    res.status(404);
    throw new Error('Slide not found');
  }

  slide.deleteOne();
  await banner.save();

  res.json({ success: true, message: 'Slide deleted' });
});

/**
 * PATCH /api/v1/hero-banner/slides/reorder
 * Body: { order: ['slideId1', 'slideId2', ...] }
 * Reorders slides by reassigning the `order` field.
 */
export const reorderSlides = asyncHandler(async (req, res) => {
  const { order } = req.body;

  if (!Array.isArray(order)) {
    res.status(400);
    throw new Error('order must be an array of slide IDs');
  }

  const banner = await getBannerDoc();

  order.forEach((id, idx) => {
    const slide = banner.slides.id(id);
    if (slide) slide.order = idx;
  });

  await banner.save();

  const slides = [...banner.slides].sort((a, b) => a.order - b.order);
  res.json({ success: true, slides });
});

/**
 * PATCH /api/v1/hero-banner/settings
 * Update global banner settings (e.g. slideDuration).
 * Body: { slideDuration: 5000 }
 */
export const updateBannerSettings = asyncHandler(async (req, res) => {
  const banner = await getBannerDoc();

  const { slideDuration } = req.body;

  if (slideDuration !== undefined) {
    if (!isFinite(Number(slideDuration)) || Number(slideDuration) < 1000) {
      res.status(400);
      throw new Error('slideDuration must be a number >= 1000');
    }
    banner.slideDuration = Number(slideDuration);
  }

  await banner.save();
  res.json({ success: true, slideDuration: banner.slideDuration });
});