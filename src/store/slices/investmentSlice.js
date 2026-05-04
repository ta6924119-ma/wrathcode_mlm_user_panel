import { createSlice } from '@reduxjs/toolkit'; // create hoti h = state , reducre, action auto generate hoti h 

// Investment Plans Configuration
export const INVESTMENT_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    min: 50,
    max: 1000,
    maxROI: 150,
    duration: 30, // days
    dailyReturn: 5, // percentage
    icon: '🥉',
    color: '#6366f1',
  },
  {
    id: 'silver',
    name: 'Silver',
    min: 200,
    max: 2000,
    maxROI: 175,
    duration: 35,
    dailyReturn: 5,
    icon: '🥈',
    color: '#4f2d9f',
  },
  {
    id: 'gold',
    name: 'Gold',
    min: 1000,
    max: 5000,
    maxROI: 200,
    duration: 40,
    dailyReturn: 5,
    icon: '🥇',
    color: '#f59e0b',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    min: 2000,
    max: 10000,
    maxROI: 225,
    duration: 45,
    dailyReturn: 5,
    icon: '💎',
    color: '#ec4899',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    min: 4000,
    max: 30000,
    maxROI: 250,
    duration: 50,
    dailyReturn: 5,
    icon: '💠',
    color: '#06b6d4',
  },
  {
    id: 'vip',
    name: 'VIP',
    min: 6000,
    max: 50000,
    maxROI: 300,
    duration: 60,
    dailyReturn: 5,
    icon: '👑',
    color: '#fbbf24',
  },
];

const initialState = {
  plans: INVESTMENT_PLANS,
  investments: [],
  activeInvestments: [],
  totalInvested: 0,
  totalReturns: 0,
  pendingReturns: 0,
  isLoading: false,
  error: null,
  selectedPlan: null,
};


//mini store module
const investmentSlice = createSlice({
  name: 'investment',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setInvestments: (state, action) => {
      state.investments = action.payload;
      state.activeInvestments = action.payload.filter(inv => inv.status === 'active');
      state.totalInvested = action.payload.reduce((sum, inv) => sum + inv.amount, 0);
      state.totalReturns = action.payload
        .filter(inv => inv.status === 'completed')
        .reduce((sum, inv) => sum + inv.returns, 0);
      state.pendingReturns = action.payload
        .filter(inv => inv.status === 'active')
        .reduce((sum, inv) => {
          const daysElapsed = Math.floor((new Date() - new Date(inv.startDate)) / (1000 * 60 * 60 * 24));
          const expectedReturn = (inv.amount * inv.plan.maxROI) / 100;
          const dailyReturn = expectedReturn / inv.plan.duration;
          return sum + (dailyReturn * daysElapsed);
        }, 0);
    },
    addInvestment: (state, action) => {
      const investment = {
        ...action.payload,
        id: Date.now().toString(),
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + action.payload.plan.duration * 24 * 60 * 60 * 1000).toISOString(),
        returns: 0,
        dailyReturns: [],
      };
      state.investments.push(investment);
      state.activeInvestments.push(investment);
      state.totalInvested += investment.amount;
    },
    updateInvestmentStatus: (state, action) => {
      const { id, status } = action.payload;
      const investment = state.investments.find(inv => inv.id === id);
      if (investment) {
        investment.status = status;
        if (status === 'completed') {
          state.activeInvestments = state.activeInvestments.filter(inv => inv.id !== id);
          state.totalReturns += investment.returns;
        }
      }
    },
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },  
    calculateDailyReturns: (state) => {
      state.activeInvestments.forEach(investment => {
        const daysElapsed = Math.floor((new Date() - new Date(investment.startDate)) / (1000 * 60 * 60 * 24));
        const expectedReturn = (investment.amount * investment.plan.maxROI) / 100;
          const dailyReturn = expectedReturn / investment.plan.duration;
        investment.returns = Math.min(dailyReturn * daysElapsed, expectedReturn);
      });
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setInvestments,
  addInvestment,
  updateInvestmentStatus,
  setSelectedPlan,
  calculateDailyReturns,
  setError,
} = investmentSlice.actions;

export default investmentSlice.reducer;
