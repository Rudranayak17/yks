import { apiSlice } from "../initalState";

const apiWithTag = apiSlice.enhanceEndpoints({
  addTagTypes: ["socitey"],
});

export const authApiSlice = apiWithTag.injectEndpoints({
  endpoints: (builder) => ({
    create_society: builder.mutation({
      query: (credentials) => ({
        url: "/api/v1/society",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credentials,
      }),
      invalidatesTags:["socitey"]
    }),

 
    get_society: builder.query({
        query: (credentials) => ({
          url: "/api/v1/society",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
    
        }),
        providesTags:["socitey"]
      }),
  }),
  overrideExisting: true,
});

export const {
    useCreate_societyMutation,
    useGet_societyQuery
} = authApiSlice;