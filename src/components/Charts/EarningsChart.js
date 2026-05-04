import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
import { useAppSelector } from '../../store/hooks';
import { CHART_COLORS } from '../../utils/constants';
import './Charts.css';

export const EarningsLineChart = () => {
  const { chartData } = useAppSelector((state) => state.commission);

  return (
    <div className="chart-container">
      <h3 className="chart-title">Monthly Earnings Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="month" 
            stroke="#64748b"
            tick={{ fill: '#64748b' }}
          />
          <YAxis 
            stroke="#64748b"
            tick={{ fill: '#64748b' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(30, 41, 59, 0.98)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '8px',
              color: '#e2e8f0',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
            }}
            formatter={(value) => [`$${value}`, 'Earnings']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="earnings" 
            stroke={CHART_COLORS[0]} 
            strokeWidth={3}
            dot={{ fill: CHART_COLORS[0], r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const EarningsBarChart = () => {
  const { chartData } = useAppSelector((state) => state.commission);

  return (
    <div className="chart-container">
      <h3 className="chart-title">Monthly Earnings Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="month" 
            stroke="#64748b"
            tick={{ fill: '#64748b' }}
          />
          <YAxis 
            stroke="#64748b"
            tick={{ fill: '#64748b' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(30, 41, 59, 0.98)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '8px',
              color: '#e2e8f0',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
            }}
            formatter={(value) => [`$${value}`, 'Earnings']}
          />
          <Legend />
          <Bar dataKey="earnings" fill={CHART_COLORS[0]} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CommissionBreakdownChart = () => {
  const { commissions } = useAppSelector((state) => state.commission);

  const typeData = commissions.reduce((acc, commission) => {
    const type = commission.type || 'other';
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += commission.amount;
    return acc;
  }, {});

  const pieData = Object.entries(typeData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value,
  }));

  const COLORS = CHART_COLORS.slice(0, pieData.length);

  return (
    <div className="chart-container">
      <h3 className="chart-title">Commission Type Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
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
            formatter={(value) => `$${value}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const NetworkGrowthChart = () => {
  const { members } = useAppSelector((state) => state.downline);

  // Group by join date
  const growthData = members.reduce((acc, member) => {
    const date = new Date(member.joinDate);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[monthKey]) {
      acc[monthKey] = 0;
    }
    acc[monthKey]++;
    return acc;
  }, {});

  const chartData = Object.entries(growthData)
    .map(([month, count]) => ({
      month,
      members: count,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .reduce((acc, item, index) => {
      const cumulative = index > 0 ? acc[index - 1].total : 0;
      acc.push({
        ...item,
        total: cumulative + item.members,
      });
      return acc;
    }, []);

  return (
    <div className="chart-container">
      <h3 className="chart-title">Network Growth</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="month" 
            stroke="#64748b"
            tick={{ fill: '#64748b' }}
          />
          <YAxis 
            stroke="#64748b"
            tick={{ fill: '#64748b' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(30, 41, 59, 0.98)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '8px',
              color: '#e2e8f0',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="total" 
            name="Total Members"
            stroke={CHART_COLORS[1]} 
            strokeWidth={3}
            dot={{ fill: CHART_COLORS[1], r: 5 }}
            activeDot={{ r: 8 }}
          />
          <Line 
            type="monotone" 
            dataKey="members" 
            name="New Members"
            stroke={CHART_COLORS[2]} 
            strokeWidth={2}
            dot={{ fill: CHART_COLORS[2], r: 4 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
