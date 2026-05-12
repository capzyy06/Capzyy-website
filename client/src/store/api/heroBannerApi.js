// store/api/heroBannerApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const heroBannerApi = createApi({
  reducerPath: 'heroBannerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/hero-banner`,
    credentials: 'include', // sends httpOnly auth cookie automatically
  }),
  tagTypes: ['HeroBanner'],

  endpoints: builder => ({
    // ── Public ──────────────────────────────────────────────
    getHeroBanner: builder.query({
      query: () => '/',
      providesTags: ['HeroBanner'],
    }),

    // ── Admin ────────────────────────────────────────────────
    adminGetHeroBanner: builder.query({
      query: () => '/admin',
      providesTags: ['HeroBanner'],
    }),

    addSlide: builder.mutation({
      query: body => ({ url: '/slides', method: 'POST', body }),
      invalidatesTags: ['HeroBanner'],
    }),

    updateSlide: builder.mutation({
      query: ({ slideId, ...body }) => ({
        url: `/slides/${slideId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['HeroBanner'],
    }),

    deleteSlide: builder.mutation({
      query: slideId => ({ url: `/slides/${slideId}`, method: 'DELETE' }),
      invalidatesTags: ['HeroBanner'],
    }),

    reorderSlides: builder.mutation({
      query: order => ({
        url: '/slides/reorder',
        method: 'PATCH',
        body: { order },
      }),
      invalidatesTags: ['HeroBanner'],
    }),

    updateBannerSettings: builder.mutation({
      query: body => ({ url: '/settings', method: 'PATCH', body }),
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