// authMiddleware.js
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// BUG C-5 FIX: read token from httpOnly cookie instead of Authorization header
export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id).select('-password');

  if (!req.user || !req.user.isActive) {
    res.status(401);
    throw new Error('Not authorized');
  }

  next();
});

export const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') {
    return next();
  }

  res.status(403);
  throw new Error('Admin access required');
};