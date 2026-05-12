import mongoose from 'mongoose';

// ── Single slide schema ────────────────────────────────────────
const slideSchema = new mongoose.Schema(
  {
    // Image (uploaded via /api/v1/media/upload → Cloudinary)
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },

    // Text content
    eyebrow: {
      type: String,
      default: '— WEAR THE',
      trim: true,
      maxlength: 80,
    },

    headline: {
      type: String,
      default: 'C U L T U R E',
      trim: true,
      maxlength: 120,
    },

    subHeadline: {
      type: String,
      default: 'CAPZYY',
      trim: true,
      maxlength: 120,
    },

    bodyText: {
      type: String,
      default: "India's premium cap brand. Built loud. Worn louder.",
      trim: true,
      maxlength: 300,
    },

    // Colors
    eyebrowColor: { type: String, default: '#C8F135' },
    headlineColor: { type: String, default: '#F5F0E8' },
    subHeadlineColor: { type: String, default: 'rgba(245,240,232,0.3)' },
    bodyTextColor: { type: String, default: '#aaa' },
    accentColor: { type: String, default: '#C8F135' }, // used for highlighted span

    // Primary CTA
    primaryBtnLabel: { type: String, default: 'Shop Now', maxlength: 40 },
    primaryBtnLink: { type: String, default: '/shop' },
    primaryBtnBg: { type: String, default: '#C8F135' },
    primaryBtnText: { type: String, default: '#0a0a0a' },

    // Secondary CTA
    secondaryBtnLabel: { type: String, default: 'New Drops', maxlength: 40 },
    secondaryBtnLink: { type: String, default: '/category/new-arrivals' },

    // Slide meta
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: true, timestamps: true }
);

// ── Root banner doc (singleton — one doc manages all slides) ──
const heroBannerSchema = new mongoose.Schema(
  {
    slideDuration: {
      type: Number,
      default: 4500,
      min: 1000,
      max: 15000,
    },
    slides: {
      type: [slideSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const HeroBanner = mongoose.model('HeroBanner', heroBannerSchema);
export default HeroBanner;