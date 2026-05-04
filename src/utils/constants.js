// Application constants

export const COMMISSION_TYPES = {
  DIRECT: 'direct',
  LEVEL_1: 'level1',
  LEVEL_2: 'level2',
  BONUS: 'bonus',
};

export const COMMISSION_RATES = {
  [COMMISSION_TYPES.DIRECT]: 0.10, // 10%
  [COMMISSION_TYPES.LEVEL_1]: 0.05, // 5%
  [COMMISSION_TYPES.LEVEL_2]: 0.03, // 3%
  [COMMISSION_TYPES.BONUS]: 0.15, // 15% for bonuses
};

export const STATUS_COLORS = {
  pending: '#f59e0b',
  paid: '#10b981',
  cancelled: '#ef4444',
};

export const LEVEL_COLORS = {
  1: '#6366f1',
  2: '#8b5cf6',
  3: '#ec4899',
  4: '#f59e0b',
  5: '#10b981',
};

export const CHART_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#3b82f6',
];
