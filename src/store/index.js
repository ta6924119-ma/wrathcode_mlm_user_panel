import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import downlineSlice from './slices/downlineSlice';
import commissionSlice from './slices/commissionSlice';
import userSlice from './slices/userSlice';
import investmentSlice from './slices/investmentSlice';
import mlmSystemSlice from './slices/mlmSystemSlice';
import walletSlice from './slices/walletSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    downline: downlineSlice,
    commission: commissionSlice,
    user: userSlice,
    investment: investmentSlice,
    mlmSystem: mlmSystemSlice,
    wallet: walletSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
