import express from 'express';

import {
  uploadMedia,
  deleteMedia,
} from '../controllers/mediaController.js';

import {
  protect,
  adminOnly,
} from '../middleware/authMiddleware.js';

import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.post(
  '/upload',
  protect,
  adminOnly,
  upload.array('images', 10),
  uploadMedia
);

router.delete(
  '/:publicId',
  protect,
  adminOnly,
  deleteMedia
);

export default router;