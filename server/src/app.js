import './config/env.js';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import heroBannerRoutes from './routes/heroBannerRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

// ─── 0. Trust reverse proxy (Render, Railway, Heroku, Nginx, etc.) ──
// Without this, Express sees all requests as HTTP (the proxy terminates TLS).
// Consequence: cookies with secure:true are NEVER sent — every API call fails
// with "Not authorized, no token" on production/mobile even after login.
// '1' means trust exactly one hop of proxy headers (X-Forwarded-Proto etc.)
app.set('trust proxy', 1);

// ─── 1. CORS must come first — before helmet, limiters, everything ──
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.STAGING_URL,
  'http://localhost:5173',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// ─── 2. Explicitly handle OPTIONS preflight for all routes ──────────
// FIX: must use the same corsOptions — bare cors() has no credentials:true
// so browsers reject the preflight and never send the auth cookie.
app.options('*', cors(corsOptions));

// ─── 3. Security & parsing middleware ──────────────────────────────
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── 4. Rate limiters (after CORS so preflight isn't blocked) ──────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attempts, please try again later.',
  },
});

app.use('/api', limiter);

// ─── Health Check ──────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', brand: 'Capzyy' });
});

// ─── Routes ────────────────────────────────────────────────────────
app.use('/api/v1/auth',        authLimiter, authRoutes);
app.use('/api/v1/products',    productRoutes);
app.use('/api/v1/categories',  categoryRoutes);
app.use('/api/v1/orders',      orderRoutes);
app.use('/api/v1/media',       mediaRoutes);
app.use('/api/v1/hero-banner', heroBannerRoutes);
app.use('/api/v1/support',     supportRoutes);

// ─── Error Handlers ────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;