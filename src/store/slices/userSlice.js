import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  referralCode: '',
  stats: {
    totalReferrals: 0,
    activeDownline: 0,
    totalEarnings: 0,
    level: 1,
  },
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
      if (action.payload.referralCode) {
        state.referralCode = action.payload.referralCode;
      }
    },
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    setStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setProfile,
  updateProfile,
  setStats,
  setError,
} = userSlice.actions;

export default userSlice.reducer;
