import { createSlice } from '@reduxjs/toolkit';

// BUG C-5 FIX: token removed from Redux state entirely.
// Authentication is now handled via httpOnly cookie set by the server.
// The cookie is sent automatically on every request via credentials: 'include'
// in the shared baseQuery — no token ever touches localStorage or JS memory.
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.isAuthenticated = true;
      // token intentionally not stored here
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;