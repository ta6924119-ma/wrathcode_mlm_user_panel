import { createSlice } from '@reduxjs/toolkit';

// Wallet Types
export const WALLET_TYPES = {
  MAIN: 'main',
  INCOME: 'income',
  ROI: 'roi',
  FUND: 'fund',
};

const initialState = {
  wallets: {
    [WALLET_TYPES.MAIN]: {
      type: WALLET_TYPES.MAIN,
      name: 'Main Wallet',
      balance: 0,
      pending: 0,
    },
    [WALLET_TYPES.INCOME]: {
      type: WALLET_TYPES.INCOME,
      name: 'Income Wallet',
      balance: 0,
      pending: 0,
    },
    [WALLET_TYPES.ROI]: {
      type: WALLET_TYPES.ROI,
      name: 'ROI Wallet',
      balance: 0,
      pending: 0,
    },
    [WALLET_TYPES.FUND]: {
      type: WALLET_TYPES.FUND,
      name: 'Fund Wallet',
      balance: 0,
      pending: 0,
    },
  },
  transactions: [],
  transferHistory: [],
  isLoading: false,
  error: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setWallets: (state, action) => {
      state.wallets = { ...state.wallets, ...action.payload };
    },
    updateWalletBalance: (state, action) => {
      const { walletType, amount, type } = action.payload; // type: 'credit' or 'debit'
      if (state.wallets[walletType]) {
        if (type === 'credit') {
          state.wallets[walletType].balance += amount;
        } else if (type === 'debit') {
          state.wallets[walletType].balance -= amount;
        }
      }
    },
    addTransaction: (state, action) => {
      state.transactions.unshift({
        ...action.payload,
        id: Date.now().toString(),
        date: new Date().toISOString(),
      });
    },
    walletToWalletTransfer: (state, action) => {
      const { fromWallet, toWallet, amount, description } = action.payload;
      
      // Debit from source wallet
      if (state.wallets[fromWallet]) {
        state.wallets[fromWallet].balance -= amount;
      }
      
      // Credit to destination wallet
      if (state.wallets[toWallet]) {
        state.wallets[toWallet].balance += amount;
      }
      
      // Add to transfer history
      state.transferHistory.unshift({
        id: Date.now().toString(),
        fromWallet,
        toWallet,
        amount,
        description,
        date: new Date().toISOString(),
      });
      
      // Add transaction records
      state.transactions.unshift({
        id: `debit_${Date.now()}`,
        walletType: fromWallet,
        type: 'debit',
        amount,
        description: `Transfer to ${state.wallets[toWallet]?.name || toWallet}`,
        date: new Date().toISOString(),
      });
      
      state.transactions.unshift({
        id: `credit_${Date.now() + 1}`,
        walletType: toWallet,
        type: 'credit',
        amount,
        description: `Transfer from ${state.wallets[fromWallet]?.name || fromWallet}`,
        date: new Date().toISOString(),
      });
    },
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    setTransferHistory: (state, action) => {
      state.transferHistory = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setWallets,
  updateWalletBalance,
  addTransaction,
  walletToWalletTransfer,
  setTransactions,
  setTransferHistory,
  setError,
} = walletSlice.actions;

export default walletSlice.reducer;
