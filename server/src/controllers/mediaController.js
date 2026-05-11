import asyncHandler from 'express-async-handler';
import { cloudinary } from '../config/cloudinary.js';

export const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.files?.length && !req.file) {
    res.status(400);
    throw new Error('No files uploaded');
  }

  const files = req.files || [req.file];

  const uploaded = files.map((file) => ({
    url: file.path,
    publicId: file.filename,
  }));

  res.status(201).json({
    success: true,
    files: uploaded,
  });
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  await cloudinary.uploader.destroy(
    decodeURIComponent(publicId)
  );

  res.json({
    success: true,
    message: 'Image deleted from Cloudinary',
  });
});