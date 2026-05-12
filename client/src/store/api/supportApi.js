import axios from "axios";
import { io } from "socket.io-client";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// ─── Axios Instance ───────────────────────────────────────────────
const api = axios.create({
  baseURL: `${BASE}/support`,
  withCredentials: true,           // ← sends httpOnly cookie automatically
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
    socketInstance = io(`${BASE}/support`, {
      withCredentials: true,       // ← cookie-based auth, no token needed
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