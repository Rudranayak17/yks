import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const storeToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('token', token);
  } catch (error) {
    console.error('Error storing token:', error);
    throw error; // Re-throw the error to handle elsewhere if needed
  }
};

const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.error('Error removing token:', error);
    throw error; // Re-throw the error to handle elsewhere if needed
  }
};

const initialState: any = {
  token: null,
  message: null,
  isLoading: true,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<any>) => {
      const { token, message } = action.payload;
      state.token = token;
      state.message = message || '';
      state.isAuthenticated = true;
      state.isLoading = false;
      // Call async function separately to handle promise
      storeToken(token).catch((error) => {
        console.error('Failed to store token:', error);
        // Handle error state or logging as needed
      });
    },
    logout: (state) => {
      state.token = null;
      state.message = 'Logged out successfully';
      state.isAuthenticated = false;
      state.isLoading = false;
      // Call async function separately to handle promise
      removeToken().catch((error) => {
        console.error('Failed to remove token:', error);
        // Handle error state or logging as needed
      });
    },
    clearError: (state) => {
      state.token = null;
      state.message = 'Error occurred while authentication';
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
});

export const { setCredentials, logout, clearError } = authSlice.actions;
export const selectCurrentMessage = (state: { auth: any }) =>
  state.auth.message;
export const selectCurrentToken = (state: { auth: any }) => state.auth.token;
export const selectCurrentLoading = (state: { auth: any }) =>
  state.auth.isLoading;
export const selectCurrentIsAuth = (state: { auth: any }) =>
  state.auth.isAuthenticated;

export default authSlice.reducer;
