import { createSlice } from '@reduxjs/toolkit';

// MLM Types
export const MLM_TYPES = {
  UNILEVEL: 'unilevel',
  BINARY: 'binary',
  MATRIX: 'matrix',
  FORCED_MATRIX: 'forced_matrix',
  STAIR_STEP_BREAKAWAY: 'stair_step_breakaway',
  CYBERNETIC: 'cybernetic',
  GENERATION: 'generation',
  AUSTRALIAN_BINARY: 'australian_binary',
  LEVEL_ONLY: 'level_only',
  HYBRID: 'hybrid',
  BOARD: 'board',
  ROI: 'roi',
};

// Commission Types
export const COMMISSION_TYPES = {
  DIRECT_REFERRAL: 'direct_referral',
  LEVEL_COMMISSION: 'level_commission',
  BINARY_PAIRING: 'binary_pairing',
  MATRIX_BONUS: 'matrix_bonus',
  MATCHING_BONUS: 'matching_bonus',
  LEADERSHIP_BONUS: 'leadership_bonus',
  RANK_BONUS: 'rank_bonus',
  PERFORMANCE_BONUS: 'performance_bonus',
  ROYALTY_BONUS: 'royalty_bonus',
  INVESTMENT_COMMISSION: 'investment_commission',
  FAST_START_BONUS: 'fast_start_bonus',
  INFINITY_BONUS: 'infinity_bonus',
  POWER_BONUS: 'power_bonus',
  TEAM_BONUS: 'team_bonus',
  OVERRIDE_BONUS: 'override_bonus',
  CAPPING_BONUS: 'capping_bonus',
  BOARD_INCOME: 'board_income',
  ROI_INCOME: 'roi_income',
  REWARD_INCOME: 'reward_income',
};

// Cycle Types
export const CYCLE_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom',
};

// Advanced MLM Features
export const ADVANCED_FEATURES = {
  AUTO_FLUSH: 'auto_flush',
  COMPRESSION: 'compression',
  SPILLOVER: 'spillover',
  CAPPING: 'capping',
  INFINITY_BONUS: 'infinity_bonus',
  FAST_START: 'fast_start',
  POWER_BONUS: 'power_bonus',
  TEAM_BONUS: 'team_bonus',
  OVERRIDE_BONUS: 'override_bonus',
};

// Rank System
export const RANKS = {
  STARTER: { id: 1, name: 'Starter', minTeam: 0, minVolume: 0, bonus: 0 },
  BRONZE: { id: 2, name: 'Bronze', minTeam: 5, minVolume: 1000, bonus: 5 },
  SILVER: { id: 3, name: 'Silver', minTeam: 15, minVolume: 5000, bonus: 10 },
  GOLD: { id: 4, name: 'Gold', minTeam: 50, minVolume: 20000, bonus: 15 },
  PLATINUM: { id: 5, name: 'Platinum', minTeam: 150, minVolume: 50000, bonus: 20 },
  DIAMOND: { id: 6, name: 'Diamond', minTeam: 500, minVolume: 200000, bonus: 25 },
  CROWN: { id: 7, name: 'Crown', minTeam: 1500, minVolume: 500000, bonus: 30 },
};

const initialState = {
  mlmType: MLM_TYPES.UNILEVEL,
  settings: {
    maxLevels: 10,
    levelCommissions: [10, 5, 3, 2, 1.5, 1, 0.5, 0.5, 0.5, 0.5], // Percentage for each level
    levelCapping: [1000, 500, 300, 200, 150, 100, 50, 50, 50, 50], // Maximum commission per level
    binaryPairingBonus: 10, // Percentage
    binaryFlushEnabled: true, // Auto-flush for binary
    binaryFlushThreshold: 100, // Amount to trigger flush
    binaryCompression: true, // Remove inactive from calculations
    matrixWidth: 3,
    matrixDepth: 5,
    matrixSpillover: true, // Automatic placement
    forcedMatrixWidth: 3,
    forcedMatrixDepth: 5,
    matchingBonusLevels: 5,
    matchingBonusPercent: 5,
    leadershipBonusPercent: 2,
    breakawayLevel: 5, // For stair step breakaway
    breakawayCommission: 3, // Percentage
    cycleAmount: 100, // For cybernetic
    cycleCommission: 5, // Percentage
    cycleType: CYCLE_TYPES.DAILY, // Daily, Weekly, Monthly
    generationLevels: 3, // For generation
    generationCommission: [10, 5, 2], // Percentage per generation
    australianBinaryRatio: 2, // Ratio for Australian Binary
    fastStartBonus: 50, // Fast start bonus amount
    fastStartDays: 30, // Days for fast start qualification
    infinityBonusEnabled: true, // Unlimited depth bonus
    infinityBonusPercent: 1, // Percentage for infinity
    powerBonusEnabled: true, // Power bonus for high performers
    powerBonusThreshold: 10000, // Volume threshold
    powerBonusPercent: 2, // Percentage
    teamBonusEnabled: true, // Team performance bonus
    teamBonusLevels: 3, // Levels for team bonus
    overrideBonusEnabled: true, // Override bonus
    overrideBonusPercent: 1, // Percentage
    globalCapping: 50000, // Global commission cap
    minWithdrawal: 10,  
    maxWithdrawal: 10000,
    withdrawalFee: 2, // Percentage
    autoWithdrawal: false, // Auto withdrawal when threshold reached
    autoWithdrawalThreshold: 100, // Threshold for auto withdrawal
  },
  userRank: RANKS.STARTER,
  teamStats: {
    totalTeamSize: 0,
    directReferrals: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    totalVolume: 0,
    leftLegVolume: 0,
    rightLegVolume: 0,
    weakLeg: 'left',
    carryForward: 0,
    compressedVolume: 0, // Volume after compression
    spilloverCount: 0, // Number of spillovers
    dailyVolume: 0,
    weeklyVolume: 0,
    monthlyVolume: 0,
    averageOrderValue: 0,
    conversionRate: 0,
    retentionRate: 0,
    teamDepth: 0, // Maximum depth of team
    teamWidth: 0, // Maximum width at any level
  },


  
  commissions: {
    directReferral: 0,
    levelCommissions: 0,
    binaryPairing: 0,
    matrixBonus: 0,
    matchingBonus: 0,
    leadershipBonus: 0,
    rankBonus: 0,
    performanceBonus: 0,
    royaltyBonus: 0,
    investmentCommission: 0,
    fastStartBonus: 0,
    infinityBonus: 0,
    powerBonus: 0,
    teamBonus: 0,
    overrideBonus: 0,
    total: 0,
    dailyTotal: 0,
    weeklyTotal: 0,
    monthlyTotal: 0,
    pendingTotal: 0,
    paidTotal: 0,
  },
  bonuses: [],
  rewards: [],
  performance: {
    monthlyVolume: 0,
    quarterlyVolume: 0,
    yearlyVolume: 0,
    personalVolume: 0,
    teamVolume: 0,
    growthRate: 0,
    dailyEarnings: [],
    weeklyEarnings: [],
    monthlyEarnings: [],
    topPerformers: [],
    weakPerformers: [],
    conversionFunnel: {
      visitors: 0,
      signups: 0,
      active: 0,
      investors: 0,
    },
    trends: {
      volume: [],
      commissions: [],
      teamSize: [],
    },
  },

  // genealogy structure
  genealogy: {
    leftLeg: [],
    rightLeg: [],
    unilevel: [],
    matrix: [],
    networkMap: {}, // Complete network structure
    depthMap: {}, // Depth information
    levelDistribution: {}, // Members per level
  },


  // Commission history
  commissionHistory: [], // Detailed commission history
  cycleHistory: [], // Cycle completion history
  flushHistory: [], // Binary flush history
  analytics: {
    realTimeStats: {},
    predictions: {},
    recommendations: [],
  },
  isLoading: false,
  error: null,
};

const mlmSystemSlice = createSlice({
  name: 'mlmSystem',
  initialState,
  reducers: {
    setMLMType: (state, action) => {
      state.mlmType = action.payload;
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    setUserRank: (state, action) => {
      state.userRank = action.payload;
    },
    updateTeamStats: (state, action) => {
      state.teamStats = { ...state.teamStats, ...action.payload };
      // Auto-calculate rank based on team stats
      const { totalTeamSize, totalVolume } = state.teamStats;
      const newRank = Object.values(RANKS)
        .reverse()
        .find(rank => totalTeamSize >= rank.minTeam && totalVolume >= rank.minVolume);
      if (newRank && newRank.id > state.userRank.id) {
        state.userRank = newRank;
      }
    },
    calculateCommissions: (state, action) => {
      const { investmentAmount, level, userId, timestamp } = action.payload;
      const { settings, mlmType } = state;
      const now = timestamp || new Date().toISOString();
      
      // Apply compression if enabled
      let effectiveVolume = investmentAmount;
      if (settings.binaryCompression) {
        // Remove inactive members from volume calculation
        const activeRatio = state.teamStats.activeMembers / (state.teamStats.totalTeamSize || 1);
        effectiveVolume = investmentAmount * activeRatio;
        state.teamStats.compressedVolume += effectiveVolume;
      }
      
      // Direct Referral Commission (All types) with Fast Start Bonus
      if (level === 0) {
        const directCommission = (effectiveVolume * settings.levelCommissions[0]) / 100;
        state.commissions.directReferral += directCommission;
        state.commissions.total += directCommission;
        
        // Fast Start Bonus (within first N days)
        const daysSinceJoin = Math.floor((new Date(now).getTime() - new Date(userId?.joinDate || now).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceJoin <= settings.fastStartDays && settings.fastStartBonus > 0) {
          const fastStartBonus = Math.min(settings.fastStartBonus, effectiveVolume * 0.1);
          state.commissions.fastStartBonus += fastStartBonus;
          state.commissions.total += fastStartBonus;
        }
      }
      
      // UNILEVEL - Level-based commissions with capping
      if (mlmType === MLM_TYPES.UNILEVEL && level > 0 && level <= settings.maxLevels) {
        const levelCommissionPercent = settings.levelCommissions[level] || 0;
        const levelCommission = (effectiveVolume * levelCommissionPercent) / 100;
        const cappedCommission = settings.levelCapping[level] 
          ? Math.min(levelCommission, settings.levelCapping[level])
          : levelCommission;
        state.commissions.levelCommissions += cappedCommission;
        state.commissions.total += cappedCommission;
        
        // Infinity Bonus (unlimited depth)
        if (settings.infinityBonusEnabled && level > settings.maxLevels) {
          const infinityBonus = (effectiveVolume * settings.infinityBonusPercent) / 100;
          state.commissions.infinityBonus += infinityBonus;
          state.commissions.total += infinityBonus;
        }
      }
      
      // BINARY - Two leg pairing system with auto-flush
      if (mlmType === MLM_TYPES.BINARY || mlmType === MLM_TYPES.AUSTRALIAN_BINARY) {
        let { leftLegVolume, rightLegVolume, carryForward } = state.teamStats;
        
        // Update leg volumes
        if (level === 0) {
          // Determine which leg based on position
          const legPosition = userId?.legPosition || (leftLegVolume <= rightLegVolume ? 'left' : 'right');
          if (legPosition === 'left') {
            leftLegVolume += effectiveVolume;
            state.teamStats.leftLegVolume = leftLegVolume;
          } else {
            rightLegVolume += effectiveVolume;
            state.teamStats.rightLegVolume = rightLegVolume;
          }
        }
        
        // Auto-flush logic
        if (settings.binaryFlushEnabled) {
          const weakLeg = Math.min(leftLegVolume, rightLegVolume);
          const strongLeg = Math.max(leftLegVolume, rightLegVolume);
          const difference = strongLeg - weakLeg;
          
          if (difference >= settings.binaryFlushThreshold) {
            // Flush the weak leg
            const flushAmount = weakLeg;
            const pairingCommission = (flushAmount * settings.binaryPairingBonus) / 100;
            state.commissions.binaryPairing += pairingCommission;
            state.commissions.total += pairingCommission;
            
            // Record flush
            state.flushHistory.push({
              date: now,
              leftLegVolume,
              rightLegVolume,
              flushAmount,
              commission: pairingCommission,
            });
            
            // Reset volumes after flush
            state.teamStats.leftLegVolume = difference;
            state.teamStats.rightLegVolume = 0;
            state.teamStats.carryForward = 0;
          } else {
            // Calculate pairing on weak leg
            const pairingCommission = (weakLeg * settings.binaryPairingBonus) / 100;
            state.commissions.binaryPairing += pairingCommission;
            state.commissions.total += pairingCommission;
            state.teamStats.carryForward = difference;
          }
        } else {
          // Standard binary pairing
          const weakLeg = Math.min(leftLegVolume, rightLegVolume);
          const pairingCommission = (weakLeg * settings.binaryPairingBonus) / 100;
          state.commissions.binaryPairing += pairingCommission;
          state.commissions.total += pairingCommission;
        }
      }
      
      // AUSTRALIAN BINARY - Ratio-based binary
      if (mlmType === MLM_TYPES.AUSTRALIAN_BINARY) {
        const { leftLegVolume, rightLegVolume } = state.teamStats;
        const ratio = leftLegVolume / (rightLegVolume || 1);
        if (ratio >= 1 / settings.australianBinaryRatio && ratio <= settings.australianBinaryRatio) {
          const weakLeg = Math.min(leftLegVolume, rightLegVolume);
          const pairingCommission = (weakLeg * settings.binaryPairingBonus) / 100;
          state.commissions.binaryPairing += pairingCommission;
          state.commissions.total += pairingCommission;
        }
      }
      
      // MATRIX - Fixed width/depth structure with spillover
      if (mlmType === MLM_TYPES.MATRIX && level > 0 && level <= settings.matrixDepth) {
        const matrixBonus = (effectiveVolume * settings.levelCommissions[level]) / 100;
        state.commissions.matrixBonus += matrixBonus;
        state.commissions.total += matrixBonus;
        
        // Spillover logic
        if (settings.matrixSpillover && level < settings.matrixDepth) {
          const positionsAtLevel = Math.pow(settings.matrixWidth, level);
          const filledPositions = state.genealogy.matrix.filter(m => m.level === level).length;
          
          if (filledPositions >= positionsAtLevel) {
            // Spillover to next level
            state.teamStats.spilloverCount += 1;
          }
        }
      }
      
      // FORCED MATRIX - Strict matrix structure
      if (mlmType === MLM_TYPES.FORCED_MATRIX && level > 0 && level <= settings.forcedMatrixDepth) {
        const matrixBonus = (effectiveVolume * settings.levelCommissions[level]) / 100;
        state.commissions.matrixBonus += matrixBonus;
        state.commissions.total += matrixBonus;
      }
      
      // STAIR STEP BREAKAWAY - Breakaway commission structure
      if (mlmType === MLM_TYPES.STAIR_STEP_BREAKAWAY) {
        if (level > 0 && level <= settings.breakawayLevel) {
          const breakawayCommission = (investmentAmount * settings.breakawayCommission) / 100;
          state.commissions.levelCommissions += breakawayCommission;
          state.commissions.total += breakawayCommission;
        }
        // After breakaway level, only direct commissions
        if (level > settings.breakawayLevel && level <= settings.maxLevels) {
          const levelCommission = (investmentAmount * settings.levelCommissions[level]) / 100;
          state.commissions.levelCommissions += levelCommission;
          state.commissions.total += levelCommission;
        }
      }
      
      // CYBERNETIC - Cycle-based system with cycle types
      if (mlmType === MLM_TYPES.CYBERNETIC) {
        const cycles = Math.floor(effectiveVolume / settings.cycleAmount);
        if (cycles > 0) {
          const cycleCommission = (cycles * settings.cycleAmount * settings.cycleCommission) / 100;
          state.commissions.levelCommissions += cycleCommission;
          state.commissions.total += cycleCommission;
          
          // Record cycle completion
          state.cycleHistory.push({
            date: now,
            cycles,
            amount: cycles * settings.cycleAmount,
            commission: cycleCommission,
            cycleType: settings.cycleType,
          });
        }
      }
      
      // GENERATION - Generation-based commissions
      if (mlmType === MLM_TYPES.GENERATION && level > 0 && level <= settings.generationLevels) {
        const generationIndex = Math.min(level - 1, settings.generationCommission.length - 1);
        const generationCommission = (investmentAmount * settings.generationCommission[generationIndex]) / 100;
        state.commissions.levelCommissions += generationCommission;
        state.commissions.total += generationCommission;
      }
      
      // LEVEL ONLY - Simple level-based commissions
      if (mlmType === MLM_TYPES.LEVEL_ONLY && level > 0 && level <= settings.maxLevels) {
        const levelCommission = (investmentAmount * settings.levelCommissions[level]) / 100;
        state.commissions.levelCommissions += levelCommission;
        state.commissions.total += levelCommission;
      }
      
      // HYBRID - Combination of multiple types
      if (mlmType === MLM_TYPES.HYBRID) {
        // Apply unilevel logic
        if (level > 0 && level <= settings.maxLevels) {
          const levelCommission = (investmentAmount * settings.levelCommissions[level]) / 100;
          state.commissions.levelCommissions += levelCommission;
          state.commissions.total += levelCommission;
        }
        // Apply binary logic
        const { leftLegVolume, rightLegVolume } = state.teamStats;
        const weakLeg = Math.min(leftLegVolume, rightLegVolume);
        const pairingCommission = (weakLeg * settings.binaryPairingBonus) / 100;
        state.commissions.binaryPairing += pairingCommission;
        state.commissions.total += pairingCommission;
      }
      
      // Matching Bonus (Applicable to all types)
      if (level <= settings.matchingBonusLevels) {
        const matchingBonus = (investmentAmount * settings.matchingBonusPercent) / 100;
        state.commissions.matchingBonus += matchingBonus;
        state.commissions.total += matchingBonus;
      }
      
      // Rank Bonus (Applicable to all types)
      if (state.userRank.bonus > 0) {
        const rankBonus = (effectiveVolume * state.userRank.bonus) / 100;
        state.commissions.rankBonus += rankBonus;
        state.commissions.total += rankBonus;
      }
      
      // Power Bonus (High volume performers)
      if (settings.powerBonusEnabled && state.teamStats.totalVolume >= settings.powerBonusThreshold) {
        const powerBonus = (effectiveVolume * settings.powerBonusPercent) / 100;
        state.commissions.powerBonus += powerBonus;
        state.commissions.total += powerBonus;
      }
      
      // Team Bonus (Multi-level team performance)
      if (settings.teamBonusEnabled && level <= settings.teamBonusLevels) {
        const teamBonus = (effectiveVolume * (settings.teamBonusLevels - level + 1) * 0.5) / 100;
        state.commissions.teamBonus += teamBonus;
        state.commissions.total += teamBonus;
      }
      
      // Override Bonus (Leadership override)
      if (settings.overrideBonusEnabled && state.userRank.id >= RANKS.GOLD.id) {
        const overrideBonus = (effectiveVolume * settings.overrideBonusPercent) / 100;
        state.commissions.overrideBonus += overrideBonus;
        state.commissions.total += overrideBonus;
      }
      
      // Apply Global Capping
      if (settings.globalCapping > 0 && state.commissions.total > settings.globalCapping) {
        const excess = state.commissions.total - settings.globalCapping;
        state.commissions.total = settings.globalCapping;
        state.commissions.cappingBonus = excess; // Store excess as capping bonus
      }
      
      // Update cycle-based totals
      const date = new Date(now);
      const today = date.toISOString().split('T')[0];
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay())).toISOString().split('T')[0];
      const monthStart = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
      
      // Record commission history
      state.commissionHistory.push({
        date: now,
        type: level === 0 ? COMMISSION_TYPES.DIRECT_REFERRAL : COMMISSION_TYPES.LEVEL_COMMISSION,
        level,
        amount: effectiveVolume,
        commission: state.commissions.total - (state.commissionHistory.reduce((sum, c) => sum + c.commission, 0) || 0),
        mlmType,
        userId,
      });
      
      // Update daily/weekly/monthly totals
      const lastCommission = state.commissionHistory[state.commissionHistory.length - 1];
      if (lastCommission) {
        const commissionAmount = lastCommission.commission || 0;
        state.commissions.dailyTotal += commissionAmount;
        state.commissions.weeklyTotal += commissionAmount;
        state.commissions.monthlyTotal += commissionAmount;
      }
    },
    addBonus: (state, action) => {
      state.bonuses.push({
        ...action.payload,
        id: Date.now().toString(),
        date: new Date().toISOString(),
      });
    },
    addReward: (state, action) => {
      state.rewards.push({
        ...action.payload,
        id: Date.now().toString(),
        date: new Date().toISOString(),
      });
    },
    updatePerformance: (state, action) => {
      state.performance = { ...state.performance, ...action.payload };
    },
    updateGenealogy: (state, action) => {
      const { type, data } = action.payload;
      if (type === 'leftLeg') {
        state.genealogy.leftLeg = data;
      } else if (type === 'rightLeg') {
        state.genealogy.rightLeg = data;
      } else if (type === 'unilevel') {
        state.genealogy.unilevel = data;
      }
    },
    resetCommissions: (state) => {
      state.commissions = {
        directReferral: 0,
        levelCommissions: 0,
        binaryPairing: 0,
        matrixBonus: 0,
        matchingBonus: 0,
        leadershipBonus: 0,
        rankBonus: 0,
        performanceBonus: 0,
        royaltyBonus: 0,
        investmentCommission: 0,
        fastStartBonus: 0,
        infinityBonus: 0,
        powerBonus: 0,
        teamBonus: 0,
        overrideBonus: 0,
        total: 0,
        dailyTotal: 0,
        weeklyTotal: 0,
        monthlyTotal: 0,
        pendingTotal: 0,
        paidTotal: 0,
      };
    },
    processBinaryFlush: (state) => {
      if (state.mlmType === MLM_TYPES.BINARY && state.settings.binaryFlushEnabled) {
        const { leftLegVolume, rightLegVolume } = state.teamStats;
        const weakLeg = Math.min(leftLegVolume, rightLegVolume);
        const flushAmount = weakLeg;
        const pairingCommission = (flushAmount * state.settings.binaryPairingBonus) / 100;
        
        state.commissions.binaryPairing += pairingCommission;
        state.commissions.total += pairingCommission;
        
        state.flushHistory.push({
          date: new Date().toISOString(),
          leftLegVolume,
          rightLegVolume,
          flushAmount,
          commission: pairingCommission,
        });
        
        const difference = Math.abs(leftLegVolume - rightLegVolume);
        state.teamStats.leftLegVolume = leftLegVolume >= rightLegVolume ? difference : 0;
        state.teamStats.rightLegVolume = rightLegVolume >= leftLegVolume ? difference : 0;
        state.teamStats.carryForward = 0;
      }
    },
    updateAnalytics: (state, action) => {
      const { type, data } = action.payload;
      state.analytics[type] = data;
    },
    addCycleCompletion: (state, action) => {
      state.cycleHistory.push({
        ...action.payload,
        date: new Date().toISOString(),
      });
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setMLMType,
  updateSettings,
  setUserRank,
  updateTeamStats,
  calculateCommissions,
  addBonus,
  addReward,
  updatePerformance,
  updateGenealogy,
  resetCommissions,
  processBinaryFlush,
  updateAnalytics,
  addCycleCompletion,
  setLoading,
  setError,
} = mlmSystemSlice.actions;

export default mlmSystemSlice.reducer;
