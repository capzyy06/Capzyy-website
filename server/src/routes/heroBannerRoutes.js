import express from 'express';

import {
  getHeroBanner,
  adminGetHeroBanner,
  addSlide,
  updateSlide,
  deleteSlide,
  reorderSlides,
  updateBannerSettings,
  slideValidationRules,
} from '../controllers/heroBannerController.js';

import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Public ────────────────────────────────────────────────────
// GET /api/v1/hero-banner
router.get('/', getHeroBanner);

// ── Admin ─────────────────────────────────────────────────────
// GET /api/v1/hero-banner/admin  — all slides incl. inactive
router.get('/admin', protect, adminOnly, adminGetHeroBanner);

// POST /api/v1/hero-banner/slides  — add a slide
router.post('/slides', protect, adminOnly, slideValidationRules, addSlide);

// PUT /api/v1/hero-banner/slides/:slideId  — update a slide
router.put('/slides/:slideId', protect, adminOnly, slideValidationRules, updateSlide);

// DELETE /api/v1/hero-banner/slides/:slideId  — remove a slide
router.delete('/slides/:slideId', protect, adminOnly, deleteSlide);

// PATCH /api/v1/hero-banner/slides/reorder  — drag-and-drop order
router.patch('/slides/reorder', protect, adminOnly, reorderSlides);

// PATCH /api/v1/hero-banner/settings  — slideDuration etc.
router.patch('/settings', protect, adminOnly, updateBannerSettings);

export default router;