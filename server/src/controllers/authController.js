import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const isProd = process.env.NODE_ENV === 'production';

// ─── Cookie domain strategy ────────────────────────────────────────────────
//
// WHY THIS MATTERS FOR MOBILE:
// Safari iOS, Chrome Android, and Firefox all block third-party cookies by
// default. If your frontend (capzyy.com) and backend (api.capzyy.com) are on
// different domains, the browser treats the cookie as third-party and refuses
// to store or send it — causing every API call to fail with "Not authorized,
// no token", especially on mobile.
//
// THE FIX:
// Set COOKIE_DOMAIN=.capzyy.com (note the leading dot — it covers all
// subdomains). With a shared root domain, sameSite:'lax' is sufficient and
// works on every browser including iOS Safari with ITP enabled.
//
// DEPLOYMENT REQUIREMENTS:
//   - Frontend must be on:  capzyy.com  (or www.capzyy.com)
//   - Backend must be on:   api.capzyy.com
//   - Set env var on server: COOKIE_DOMAIN=.capzyy.com
//   - Both must be served over HTTPS in production
//
// LOCAL DEVELOPMENT:
//   - Leave COOKIE_DOMAIN unset — cookie defaults to localhost, sameSite:'lax'
// ──────────────────────────────────────────────────────────────────────────

const cookieDomain = isProd && process.env.COOKIE_DOMAIN
  ? process.env.COOKIE_DOMAIN   // e.g. ".capzyy.com"
  : undefined;                  // undefined = browser uses request host (localhost)

const cookieOptions = {
  httpOnly: true,               // JS cannot read the cookie — XSS safe
  secure: isProd,               // HTTPS only in production
  sameSite: isProd ? 'lax' : 'lax', // 'lax' works for same root domain (subdomain)
  domain: cookieDomain,         // undefined in dev, '.capzyy.com' in prod
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days in ms
};

// clearCookie must receive the EXACT same options as set (except maxAge)
// otherwise the browser ignores the clear instruction
const clearOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'lax' : 'lax',
  domain: cookieDomain,
};

// ── POST /api/v1/auth/register ────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }
  
  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error('Invalid email address');
  }

  // Password length check
  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const user = await User.create({ name, email, password, phone });

  res.cookie('token', generateToken(user._id), cookieOptions);

  res.status(201).json({ success: true, user });
});

// ── POST /api/v1/auth/login ───────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('Account disabled. Please contact support.');
  }

  res.cookie('token', generateToken(user._id), cookieOptions);

  res.json({ success: true, user });
});

// ── POST /api/v1/auth/admin/login ─────────────────────────────────
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  // Only fetch admin-role users — non-admin emails get the same
  // "Invalid credentials" response to avoid role enumeration
  const user = await User.findOne({ email: email.toLowerCase().trim(), role: 'admin' });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid admin credentials');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('Account disabled');
  }

  res.cookie('token', generateToken(user._id), cookieOptions);

  res.json({ success: true, user });
});

// ── POST /api/v1/auth/logout ──────────────────────────────────────
// FIX: clearCookie must use the same path/domain/secure/sameSite flags
// that were used when setting the cookie, otherwise browsers ignore it.
// maxAge/expires must be OMITTED from clearOptions (browser handles expiry).
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', clearOptions);
  res.json({ success: true, message: 'Logged out' });
});

// ── GET /api/v1/auth/me ───────────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});