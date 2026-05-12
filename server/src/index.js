import './config/env.js';

import http from 'http';

import { Server } from 'socket.io';

import app from './app.js';

import connectDB from './config/db.js';

// ─── Support Socket ───────────────────────────────────────────────
import supportSocket from './socket/supportSocket.js';

const PORT = process.env.PORT || 5000;

// Create HTTP server from Express app
const server = http.createServer(app);

// Attach Socket.io
const io = new Server(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL,
      process.env.STAGING_URL,
      'http://localhost:5173',
    ].filter(Boolean),

    credentials: true,
  },
});

// Initialize support socket namespace
supportSocket(io);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(
      `🚀 Capzyy server running on port ${PORT} [${process.env.NODE_ENV}]`
    );
  });
});