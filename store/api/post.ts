import { apiSlice } from '../initalState';

const apiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ['post'],
});

export const authApiSlice = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    create_post: builder.mutation({
      query: (credentials) => ({
        url: '/api/v1/post',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: credentials,
      }),
      invalidatesTags: ['post'],
    }),

    get_post: builder.query({
      query: (credentials) => ({
        url: '/api/v1/post',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      providesTags: ['post'],
    }),
    Get_post_by_id:builder.query({
        query: (credentials) => ({
          url: `/api/v1/post/${credentials._id}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
        providesTags: ['post'],
      }),
  }),
  overrideExisting: true,
});

export const { useGet_postQuery, useCreate_postMutation,useGet_post_by_idQuery } = authApiSlice;
