// store/api/categoriesApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery,
  tagTypes: ['Category'],
  endpoints: (b) => ({
    getCategories:     b.query({ query: () => '/categories',                providesTags: ['Category'] }),
    getAllCategories:  b.query({ query: () => '/categories/admin/all',      providesTags: ['Category'] }),
    getCategoryBySlug: b.query({ query: (slug) => `/categories/${slug}`,   providesTags: ['Category'] }),

    createCategory: b.mutation({
      query: (formData) => ({ url: '/categories', method: 'POST', body: formData }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: b.mutation({
      query: ({ id, formData }) => ({ url: `/categories/${id}`, method: 'PUT', body: formData }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: b.mutation({
      query: (id) => ({ url: `/categories/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetAllCategoriesQuery,
  useGetCategoryBySlugQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;