import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const rehydrateAuth = createAsyncThunk(
  'auth/rehydrate',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE}/auth/me`, {
        withCredentials: true,
      });
      return data.user;
    } catch {
      return rejectWithValue(null);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isRehydrating: false,
  },
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(rehydrateAuth.pending, (state) => {
        state.isRehydrating = true;
      })
      .addCase(rehydrateAuth.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.isAuthenticated = true;
        state.isRehydrating = false;
      })
      .addCase(rehydrateAuth.rejected, (state) => {
        // ⚠️ KEY FIX: Do NOT wipe isAuthenticated here.
        // redux-persist already restored the user from localStorage.
        // If the /auth/me call fails (network blip, cookie cleared by Safari ITP),
        // we keep the persisted state — the next real API call will catch the 401
        // and the user can log in again gracefully. Wiping here causes the
        // "logged out on back" issue on mobile Safari.
        state.isRehydrating = false;
        // Only clear if we had no user to begin with
        if (!state.user) {
          state.isAuthenticated = false;
        }
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;