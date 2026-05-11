// store/api/baseQuery.js  ← NEW FILE
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// BUG C-6 FIX: single source of truth for API base URL and credentials.
// Import this in every RTK Query api file instead of redefining fetchBaseQuery.
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  // BUG C-5 FIX: credentials:'include' sends the httpOnly cookie automatically.
  // No token in Redux state, no Authorization header needed.
  credentials: 'include',
});

export default baseQuery;