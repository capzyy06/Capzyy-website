// authController.js
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// Shared cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// POST /api/v1/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const user = await User.create({ name, email, password, phone });

  // BUG C-5 FIX: set token as httpOnly cookie, not in response body
  res.cookie('token', generateToken(user._id), cookieOptions);

  res.status(201).json({ success: true, user });
});

// POST /api/v1/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(401);
    throw new Error('Account disabled');
  }

  res.cookie('token', generateToken(user._id), cookieOptions);

  res.json({ success: true, user });
});

// POST /api/v1/auth/admin/login
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, role: 'admin' });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid admin credentials');
  }

  if (!user.isActive) {
    res.status(401);
    throw new Error('Account disabled');
  }

  res.cookie('token', generateToken(user._id), cookieOptions);

  res.json({ success: true, user });
});

// POST /api/v1/auth/logout
export const logout = asyncHandler(async (req, res) => {
  // BUG C-5 FIX: clear the cookie server-side on logout
  res.clearCookie('token', cookieOptions);
  res.json({ success: true, message: 'Logged out' });
});

// GET /api/v1/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});