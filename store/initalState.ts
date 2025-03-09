import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
const SERVER_URL = 'http://192.168.0.100:4000';
const baseQuery = fetchBaseQuery({
  baseUrl: SERVER_URL as string,
  credentials: 'include',
  prepareHeaders: async (headers, { getState }) => {
    const token = await getToken();

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const apiSlice = createApi({
  baseQuery: baseQuery as BaseQueryFn<any>,
  endpoints: (builder) => ({}),
});
