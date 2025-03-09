import { apiSlice } from "../initalState";

const apiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["user"],
});

export const authApiSlice = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/v1/user/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credentials,
      }),
    }),

    registration: builder.mutation({
      query: (credential) => ({
        url: "/api/v1/user/register",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credential,
      }),
    }),

    forgetPassword: builder.mutation({
      query: (credential) => ({
        url: "/api/v1/user/forgetpassword",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credential,
      }),
    }),

    resetpassword: builder.mutation({
      query: (credential) => ({
        url: "/api/v1/user/resetpassword",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credential,
      }),
    }),
    get_profile: builder.query({
      query: (credential) => ({
        url: "/api/v1/user/profile",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
     
      }),
      keepUnusedDataFor:0,
      providesTags:["user"]
    }),
    update_profile: builder.mutation({
      query: (credential) => ({
        url: "/api/v1/user/profile",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: credential,
      }),
    }),

  }),
  overrideExisting: true,
});

export const {
  useLoginMutation,
  useRegistrationMutation,
  useForgetPasswordMutation,
  useResetpasswordMutation,
  useGet_profileQuery,
  useUpdate_profileMutation
} = authApiSlice;