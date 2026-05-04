import React from 'react';
import './InvestmentStats.css';

const InvestmentStats = ({ totalInvested, totalReturns, pendingReturns, activeInvestments }) => {
  const stats = [
    {
      label: 'Total Invested',
      value: `$${totalInvested.toLocaleString()}`,
      icon: '💰',
      color: '#6366f1',
    },
    {
      label: 'Total Returns',
      value: `$${totalReturns.toLocaleString()}`,
      icon: '📈',
      color: '#10b981',
    },
    {
      label: 'Pending Returns',
      value: `$${pendingReturns.toFixed(2)}`,
      icon: '⏳',
      color: '#f59e0b',
    },
    // {
    //   label: 'Active Investments',
    //   value: activeInvestments,
    //   icon: '🔥',
    //   color: '#ec4899',
    // },
  ];

  return (
    <div className="investment-stats">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="investment-stat-card"
          style={{
            background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
            borderLeftColor: stat.color
          }}
        >
          <div className="stat-icon" style={{ color: stat.color }}>
            {stat.icon}
          </div>
          <div className="stat-content">
            <div className="stat-value" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InvestmentStats;
