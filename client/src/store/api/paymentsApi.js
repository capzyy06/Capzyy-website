import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

// BUG-02 FIX:
// Old code had two problems:
// 1. Used VITE_API_URL (undefined) → fell back to wrong URL missing /v1
// 2. Tried to read token from Redux state — but auth is cookie-based,
//    token is never stored in Redux, so Authorization header was always empty.
//
// Fix: use the shared baseQuery (same as every other API file) which
// already has the correct baseUrl and sends cookies via credentials:'include'.

export const paymentsApi = createApi({
  reducerPath: 'paymentsApi',
  baseQuery,
  tagTypes: ['Payment'],
  endpoints: (builder) => ({

    // Step 1 — create a Cashfree payment session from our DB order id
    createPaymentOrder: builder.mutation({
      query: (body) => ({
        url: '/payments/create-order',
        method: 'POST',
        body,
      }),
    }),

    // Step 2 — verify payment status after Cashfree redirects back
    verifyPayment: builder.mutation({
      query: (body) => ({
        url: '/payments/verify',
        method: 'POST',
        body,
      }),
    }),

  }),
});

export const {
  useCreatePaymentOrderMutation,
  useVerifyPaymentMutation,
} = paymentsApi;