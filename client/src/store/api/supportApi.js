import axios from "axios";
import { io } from "socket.io-client";

// FIX: the REST base URL must include /api/v1 to match how the backend mounts
// support routes: app.use('/api/v1/support', supportRoutes).
// The old fallback was "http://localhost:5000" which produced the wrong path
// "http://localhost:5000/support" (missing /api/v1), so every REST call 404'd
// when VITE_API_BASE_URL was not set in the environment.
//
// The Socket.IO server listens on the server ROOT with a "/support" namespace,
// NOT under /api/v1 — so the socket URL is derived separately from the server origin.
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

// Derive the bare server origin for Socket.IO (strip /api/v1 if present)
const SOCKET_ORIGIN = API_BASE.replace(/\/api\/v1\/?$/, "") || "http://localhost:5000";

// ─── Axios Instance ───────────────────────────────────────────────
const api = axios.create({
  baseURL: `${API_BASE}/support`,
  withCredentials: true, // sends httpOnly cookie automatically
});

// ─── REST Helpers ─────────────────────────────────────────────────
export const supportApi = {
  getOrCreateConversation: () =>
    api.get("/conversation").then((r) => r.data),

  getMessages: (conversationId) =>
    api.get(`/messages/${conversationId}`).then((r) => r.data),

  sendMessage: (conversationId, text) =>
    api.post("/messages", { conversationId, text }).then((r) => r.data),

  getAllConversations: () =>
    api.get("/admin/conversations").then((r) => r.data),

  markAsRead: (conversationId) =>
    api.patch(`/admin/read/${conversationId}`).then((r) => r.data),
};

// ─── Socket Singleton ─────────────────────────────────────────────
let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    // Connect to the /support namespace on the server origin (not under /api/v1)
    socketInstance = io(`${SOCKET_ORIGIN}/support`, {
      withCredentials: true, // cookie-based auth, no token needed
      autoConnect: false,
    });
  }
  return socketInstance;
};

export const connectSocket = () => {
  const socket = getSocket();
  if (!socket.connected) socket.connect();
  return socket;
};

export const disconnectSocket = () => {
  if (socketInstance?.connected) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};