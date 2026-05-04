import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
      // Save to localStorage
      localStorage.setItem('mlm_user', JSON.stringify(action.payload));
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      localStorage.removeItem('mlm_user');
    },
    checkAuth: (state) => {
      try {
        const authUser = localStorage.getItem('mlm_user');
        if (authUser) {
          const userData = JSON.parse(authUser);
          state.isAuthenticated = true;
          state.user = userData;
        }
      } catch (error) {
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('mlm_user');
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('mlm_user', JSON.stringify(state.user));
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, checkAuth, updateUser } = authSlice.actions;
export default authSlice.reducer;
