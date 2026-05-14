import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// Verify cookie is still valid on app load by hitting /auth/me
// If cookie is gone (mobile browser cleared it), this will fail
// and we force logout — preventing "not authorized" on API calls
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
      .addCase(rehydrateAuth.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.isAuthenticated = true;
      })
      .addCase(rehydrateAuth.rejected, (state) => {
        // Cookie is gone — clear Redux state too
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;