import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  commissions: [],
  totalEarnings: 0,
  monthlyEarnings: 0,
  pendingEarnings: 0,
  paidEarnings: 0,
  isLoading: false,
  error: null,
  chartData: [],
};

const commissionSlice = createSlice({
  name: 'commission',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setCommissions: (state, action) => {
      state.commissions = action.payload;
      
      // Calculate totals
      state.totalEarnings = action.payload.reduce((sum, c) => sum + c.amount, 0);
      state.monthlyEarnings = action.payload
        .filter(c => {
          const commissionDate = new Date(c.date);
          const now = new Date();
          return commissionDate.getMonth() === now.getMonth() && 
                 commissionDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, c) => sum + c.amount, 0);
      state.pendingEarnings = action.payload
        .filter(c => c.status === 'pending')
        .reduce((sum, c) => sum + c.amount, 0);
      state.paidEarnings = action.payload
        .filter(c => c.status === 'paid')
        .reduce((sum, c) => sum + c.amount, 0);
      
      // Prepare chart data
      const monthlyData = {};
      action.payload.forEach(commission => {
        const date = new Date(commission.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = 0;
        }
        monthlyData[monthKey] += commission.amount;
      });
      
      state.chartData = Object.entries(monthlyData)
        .map(([month, amount]) => ({
          month,
          earnings: amount,
        }))
        .sort((a, b) => a.month.localeCompare(b.month));
    },
    addCommission: (state, action) => {
      state.commissions.push(action.payload);
      state.totalEarnings += action.payload.amount;
      if (action.payload.status === 'pending') {
        state.pendingEarnings += action.payload.amount;
      } else if (action.payload.status === 'paid') {
        state.paidEarnings += action.payload.amount;
      }
    },
    updateCommissionStatus: (state, action) => {
      const { id, status } = action.payload;
      const commission = state.commissions.find(c => c.id === id);
      if (commission) {
        const oldStatus = commission.status;
        commission.status = status;
        
        if (oldStatus === 'pending' && status === 'paid') {
          state.pendingEarnings -= commission.amount;
          state.paidEarnings += commission.amount;
        }
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setCommissions,
  addCommission,
  updateCommissionStatus,
  setError,
} = commissionSlice.actions;

export default commissionSlice.reducer;
