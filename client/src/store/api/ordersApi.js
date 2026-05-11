// store/api/ordersApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery,
  tagTypes: ['Order'],
  endpoints: (b) => ({
    createOrder: b.mutation({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Order'],
    }),
    getOrders: b.query({
      query: (params = {}) => ({ url: '/orders', params }),
      providesTags: ['Order'],
    }),
    getOrderById: b.query({
      query: (id) => `/orders/${id}`,
      providesTags: ['Order'],
    }),
    getOrderStats: b.query({
      query: () => '/orders/stats',
      providesTags: ['Order'],
    }),
    updateOrderStatus: b.mutation({
      query: ({ id, ...body }) => ({ url: `/orders/${id}/status`, method: 'PUT', body }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderStatsQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;