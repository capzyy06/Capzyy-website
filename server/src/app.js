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
// ─── Support Routes ───────────────────────────────────────────────
import supportRoutes from './routes/supportRoutes.js';

import {
  errorHandler,
  notFound,
} from './middleware/errorHandler.js';

const app = express();

app.use(helmet());

// BUG S-13 FIX:
// support multiple origins
// (dev, staging, prod)
// without code changes

app.use(cookieParser());
// BUG S-13 FIX: support multiple origins (dev, staging, prod) without code changes
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      process.env.STAGING_URL,
      'http://localhost:5173',
    ].filter(Boolean),

    credentials: true,
  })
);

// General API limiter
// generous, just blocks obvious abuse

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 200,

  standardHeaders: true,

  legacyHeaders: false,
});

// BUG S-6 FIX:
// strict limiter on auth routes
// to prevent brute-force attacks

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 5,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,

    message:
      'Too many attempts, please try again later.',
  },
});

app.use('/api', limiter);

app.use(
  express.json({
    limit: '10mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Health Check ─────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',

    brand: 'Capzyy',
  });
});

// ─── Routes ───────────────────────────────────────────────────────

// Auth limiter applied before the router
// so it covers every auth endpoint

app.use(
  '/api/v1/auth',
  authLimiter,
  authRoutes
);

app.use(
  '/api/v1/products',
  productRoutes
);

app.use(
  '/api/v1/categories',
  categoryRoutes
);

app.use(
  '/api/v1/orders',
  orderRoutes
);

app.use(
  '/api/v1/media',
  mediaRoutes
);
app.use(
  '/api/v1/hero-banner',
  heroBannerRoutes
);

// ─── Support System Routes ───────────────────────────────────────

app.use(
  '/api/v1/support',
  supportRoutes
);

// ─── Error Handlers ───────────────────────────────────────────────

app.use(notFound);

app.use(errorHandler);

export default app;