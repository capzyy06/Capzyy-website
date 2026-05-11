import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery,
  tagTypes: ['Product'],
  endpoints: (b) => ({
    getProducts:          b.query({ query: (params = {}) => ({ url: '/products', params }),            providesTags: ['Product'] }),
    getFeatured:          b.query({ query: () => '/products/featured',                                 providesTags: ['Product'] }),
    getNewArrivals:       b.query({ query: () => '/products/new-arrivals',                             providesTags: ['Product'] }),
    getBestsellers:       b.query({ query: () => '/products/bestsellers',                              providesTags: ['Product'] }),
    getProductBySlug:     b.query({ query: (slug) => `/products/${slug}`,                              providesTags: ['Product'] }),
    adminGetAllProducts:  b.query({ query: (params = {}) => ({ url: '/products/admin/all', params }), providesTags: ['Product'] }),
    // BUG C-3 FIX: fetch a single product by ID directly (used in AdminProductForm edit mode)
    getProductById:       b.query({ query: (id) => `/products/admin/by-id/${id}`,                     providesTags: ['Product'] }),
    createProduct: b.mutation({
      query: (body) => ({ url: '/products', method: 'POST', body }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: b.mutation({
      query: ({ id, ...body }) => ({ url: `/products/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: b.mutation({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetFeaturedQuery,
  useGetNewArrivalsQuery,
  useGetBestsellersQuery,
  useGetProductBySlugQuery,
  useAdminGetAllProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;