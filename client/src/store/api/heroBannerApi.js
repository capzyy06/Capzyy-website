// store/api/heroBannerApi.js
// BUG FIX: was defining its own inline fetchBaseQuery with baseUrl that appended
// "/hero-banner" to VITE_API_BASE_URL. In production VITE_API_BASE_URL already
// ends with "/api/v1", so every request hit ".../api/v1/hero-banner/hero-banner/..."
// → 404s on all Hero Banner admin actions. Now uses the shared baseQuery and
// each endpoint prefixes "/hero-banner" explicitly — matching the server route mount.
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

export const heroBannerApi = createApi({
  reducerPath: 'heroBannerApi',
  baseQuery,
  tagTypes: ['HeroBanner'],

  endpoints: builder => ({
    // ── Public ──────────────────────────────────────────────
    getHeroBanner: builder.query({
      query: () => '/hero-banner',
      providesTags: ['HeroBanner'],
      keepUnusedDataFor: 0,
    }),

    // ── Admin ────────────────────────────────────────────────
    adminGetHeroBanner: builder.query({
      query: () => '/hero-banner/admin',
      providesTags: ['HeroBanner'],
      keepUnusedDataFor: 0,
    }),

    addSlide: builder.mutation({
      query: body => ({ url: '/hero-banner/slides', method: 'POST', body }),
      invalidatesTags: ['HeroBanner'],
    }),

    updateSlide: builder.mutation({
      query: ({ slideId, ...body }) => ({
        url: `/hero-banner/slides/${slideId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['HeroBanner'],
    }),

    deleteSlide: builder.mutation({
      query: slideId => ({ url: `/hero-banner/slides/${slideId}`, method: 'DELETE' }),
      invalidatesTags: ['HeroBanner'],
    }),

    reorderSlides: builder.mutation({
      query: order => ({
        url: '/hero-banner/slides/reorder',
        method: 'PATCH',
        body: { order },
      }),
      invalidatesTags: ['HeroBanner'],
    }),

    updateBannerSettings: builder.mutation({
      query: body => ({ url: '/hero-banner/settings', method: 'PATCH', body }),
      invalidatesTags: ['HeroBanner'],
    }),
  }),
});

export const {
  useGetHeroBannerQuery,
  useAdminGetHeroBannerQuery,
  useAddSlideMutation,
  useUpdateSlideMutation,
  useDeleteSlideMutation,
  useReorderSlidesMutation,
  useUpdateBannerSettingsMutation,
} = heroBannerApi;