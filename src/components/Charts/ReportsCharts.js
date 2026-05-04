import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { CHART_COLORS } from '../../utils/constants';
import './Charts.css';

// Commission Breakdown Pie Chart
export const CommissionBreakdownPieChart = ({ commissions }) => {
  const pieData = [
    { name: 'Direct Referral', value: commissions.directReferral || 0 },
    { name: 'Level Commissions', value: commissions.levelCommissions || 0 },
    { name: 'Binary Pairing', value: commissions.binaryPairing || 0 },
    { name: 'Matching Bonus', value: commissions.matchingBonus || 0 },
    { name: 'Fast Start', value: commissions.fastStartBonus || 0 },
    { name: 'Infinity', value: commissions.infinityBonus || 0 },
    { name: 'Power Bonus', value: commissions.powerBonus || 0 },
    { name: 'Team Bonus', value: commissions.teamBonus || 0 },
    { name: 'Override', value: commissions.overrideBonus || 0 },
  ].filter(item => item.value > 0);

  const COLORS = CHART_COLORS.slice(0, pieData.length);

  return (
    <div className="chart-container">
      <h3 className="chart-title">Commission Type Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="var(--primary-color, #8884d8)"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(30, 41, 59, 0.98)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '8px',
              color: '#e2e8f0',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
            }}
            formatter={(value) => `$${value.toFixed(2)}`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Volume Trend Line Chart
export const VolumeTrendChart = ({ performance }) => {
  const chartData = [
    { period: 'Jan', monthly: performance.monthlyVolume / 12, quarterly: performance.quarterlyVolume / 4, yearly: performance.yearlyVolume / 12 },
    { period: 'Feb', monthly: performance.monthlyVolume / 12 * 1.1, quarterly: performance.quarterlyVolume / 4 * 1.05, yearly: performance.yearlyVolume / 12 * 1.1 },
    { period: 'Mar', monthly: performance.monthlyVolume / 12 * 1.2, quarterly: performance.quarterlyVolume / 4 * 1.1, yearly: performance.yearlyVolume / 12 * 1.2 },
    { period: 'Apr', monthly: performance.monthlyVolume / 12 * 1.15, quarterly: performance.quarterlyVolume / 4 * 1.15, yearly: performance.yearlyVolume / 12 * 1.15 },
    { period: 'May', monthly: performance.monthlyVolume / 12 * 1.25, quarterly: performance.quarterlyVolume / 4 * 1.2, yearly: performance.yearlyVolume / 12 * 1.25 },
    { period: 'Jun', monthly: performance.monthlyVolume / 12 * 1.3, quarterly: performance.quarterlyVolume / 4 * 1.25, yearly: performance.yearlyVolume / 12 * 1.3 },
  ];

  return (
    <div className="chart-container">
      <h3 className="chart-title">Volume Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorQuarterly" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS[1]} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={CHART_COLORS[1]} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorYearly" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS[2]} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={CHART_COLORS[2]} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
          <XAxis 
            dataKey="period" 
            stroke="var(--card-text, #64748b)"
            tick={{ fill: 'var(--card-text, #64748b)' }}
          />
          <YAxis 
            stroke="var(--card-text, #64748b)"
            tick={{ fill: 'var(--card-text, #64748b)' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(30, 41, 59, 0.98)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '8px',
              color: '#e2e8f0',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
            }}
            formatter={(value) => `$${value.toLocaleString()}`}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="monthly" 
            name="Monthly Avg"
            stroke={CHART_COLORS[0]} 
            fillOpacity={1} 
            fill="url(#colorMonthly)" 
          />
          <Area 
            type="monotone" 
            dataKey="quarterly" 
            name="Quarterly Avg"
            stroke={CHART_COLORS[1]} 
            fillOpacity={1} 
            fill="url(#colorQuarterly)" 
          />
          <Area 
            type="monotone" 
            dataKey="yearly" 
            name="Yearly Avg"
            stroke={CHART_COLORS[2]} 
            fillOpacity={1} 
            fill="url(#colorYearly)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Team Growth Bar Chart
export const TeamGrowthChart = ({ teamStats }) => {
  const chartData = [
    { category: 'Total Team', value: teamStats.totalTeamSize || 0, color: CHART_COLORS[0] },
    { category: 'Direct Referrals', value: teamStats.directReferrals || 0, color: CHART_COLORS[1] },
    { category: 'Active Members', value: teamStats.activeMembers || 0, color: CHART_COLORS[2] },
    { category: 'Inactive', value: (teamStats.totalTeamSize || 0) - (teamStats.activeMembers || 0), color: CHART_COLORS[3] },
  ];

  return (
    <div className="chart-container">
      <h3 className="chart-title">Team Composition</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
          <XAxis 
            dataKey="category" 
            stroke="var(--card-text, #64748b)"
            tick={{ fill: 'var(--card-text, #64748b)' }}
          />
          <YAxis 
            stroke="var(--card-text, #64748b)"
            tick={{ fill: 'var(--card-text, #64748b)' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(30, 41, 59, 0.98)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '8px',
              color: '#e2e8f0',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
            }}
            formatter={(value) => [value, 'Members']}
          />
          <Legend />
          <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Performance Metrics Line Chart
export const PerformanceMetricsChart = ({ performance }) => {
  const chartData = [
    { month: 'Jan', volume: performance.monthlyVolume / 12, growth: performance.growthRate },
    { month: 'Feb', volume: performance.monthlyVolume / 12 * 1.1, growth: performance.growthRate * 1.05 },
    { month: 'Mar', volume: performance.monthlyVolume / 12 * 1.2, growth: performance.growthRate * 1.1 },
    { month: 'Apr', volume: performance.monthlyVolume / 12 * 1.15, growth: performance.growthRate * 1.08 },
    { month: 'May', volume: performance.monthlyVolume / 12 * 1.25, growth: performance.growthRate * 1.15 },
    { month: 'Jun', volume: performance.monthlyVolume / 12 * 1.3, growth: performance.growthRate * 1.2 },
  ];

  return (
    <div className="chart-container">
      <h3 className="chart-title">Performance Metrics Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            stroke="var(--card-text, #64748b)"
            tick={{ fill: 'var(--card-text, #64748b)' }}
          />
          <YAxis 
            yAxisId="left"
            stroke="var(--card-text, #64748b)"
            tick={{ fill: 'var(--card-text, #64748b)' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="var(--card-text, #64748b)"
            tick={{ fill: 'var(--card-text, #64748b)' }}
            tickFormatter={(value) => `${value.toFixed(1)}%`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(30, 41, 59, 0.98)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '8px',
              color: '#e2e8f0',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
            }}
            formatter={(value, name) => {
              if (name === 'volume') return [`$${value.toLocaleString()}`, 'Volume'];
              return [`${value.toFixed(1)}%`, 'Growth Rate'];
            }}
          />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="volume" 
            name="Volume"
            stroke={CHART_COLORS[0]} 
            strokeWidth={3}
            dot={{ fill: CHART_COLORS[0], r: 5 }}
            activeDot={{ r: 8 }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="growth" 
            name="Growth Rate %"
            stroke={CHART_COLORS[1]} 
            strokeWidth={3}
            dot={{ fill: CHART_COLORS[1], r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Binary Leg Comparison Chart
export const BinaryLegComparisonChart = ({ teamStats }) => {
  const chartData = [
    { 
      name: 'Left Leg', 
      value: teamStats.leftLegVolume || 0, 
      color: CHART_COLORS[0] 
    },
    { 
      name: 'Right Leg', 
      value: teamStats.rightLegVolume || 0, 
      color: CHART_COLORS[1] 
    },
  ];

  const weakLeg = Math.min(teamStats.leftLegVolume || 0, teamStats.rightLegVolume || 0);
  const strongLeg = Math.max(teamStats.leftLegVolume || 0, teamStats.rightLegVolume || 0);
  const difference = Math.abs((teamStats.leftLegVolume || 0) - (teamStats.rightLegVolume || 0));

  return (
    <div className="chart-container">
      <h3 className="chart-title">Binary Leg Volume Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
          <XAxis 
            dataKey="name" 
            stroke="var(--card-text, #64748b)"
            tick={{ fill: 'var(--card-text, #64748b)' }}
          />
          <YAxis 
            stroke="var(--card-text, #64748b)"
            tick={{ fill: 'var(--card-text, #64748b)' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(30, 41, 59, 0.98)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '8px',
              color: '#e2e8f0',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
            }}
            formatter={(value) => [`$${value.toLocaleString()}`, 'Volume']}
          />
          <Legend />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        background: 'rgba(99, 102, 241, 0.1)', 
        borderRadius: '8px',
        fontSize: '14px',
        color: '#e2e8f0'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <strong>Pairing Volume:</strong> ${weakLeg.toLocaleString()} (${((weakLeg / (strongLeg || 1)) * 100).toFixed(1)}% of strong leg)
        </div>
        <div>
          <strong>Carry Forward:</strong> ${difference.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

// Commission Trend Chart
export const CommissionTrendChart = ({ commissions }) => {
  const chartData = [
    { month: 'Jan', total: commissions.total / 6, direct: commissions.directReferral / 6, level: commissions.levelCommissions / 6 },
    { month: 'Feb', total: commissions.total / 6 * 1.1, direct: commissions.directReferral / 6 * 1.1, level: commissions.levelCommissions / 6 * 1.05 },
    { month: 'Mar', total: commissions.total / 6 * 1.2, direct: commissions.directReferral / 6 * 1.2, level: commissions.levelCommissions / 6 * 1.1 },
    { month: 'Apr', total: commissions.total / 6 * 1.15, direct: commissions.directReferral / 6 * 1.15, level: commissions.levelCommissions / 6 * 1.08 },
    { month: 'May', total: commissions.total / 6 * 1.25, direct: commissions.directReferral / 6 * 1.25, level: commissions.levelCommissions / 6 * 1.15 },
    { month: 'Jun', total: commissions.total / 6 * 1.3, direct: commissions.directReferral / 6 * 1.3, level: commissions.levelCommissions / 6 * 1.2 },
  ];

  return (
    <div className="chart-container">
      <h3 className="chart-title">Commission Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            stroke="var(--card-text, #64748b)"
            tick={{ fill: 'var(--card-text, #64748b)' }}
          />
          <YAxis 
            stroke="var(--card-text, #64748b)"
            tick={{ fill: 'var(--card-text, #64748b)' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(30, 41, 59, 0.98)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '8px',
              color: '#e2e8f0',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
            }}
            formatter={(value) => `$${value.toFixed(2)}`}
          />
          <Legend />
          <Bar dataKey="total" name="Total Commissions" fill={CHART_COLORS[0]} radius={[8, 8, 0, 0]} />
          <Bar dataKey="direct" name="Direct Referral" fill={CHART_COLORS[1]} radius={[8, 8, 0, 0]} />
          <Bar dataKey="level" name="Level Commissions" fill={CHART_COLORS[2]} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
