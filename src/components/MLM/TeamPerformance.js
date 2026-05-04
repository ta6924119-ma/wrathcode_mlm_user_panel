import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateTeamStats, updatePerformance } from '../../store/slices/mlmSystemSlice';
import { FaUsers, FaChartLine, FaTrophy, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { TeamGrowthChart, VolumeTrendChart, PerformanceMetricsChart, BinaryLegComparisonChart } from '../Charts/ReportsCharts';
import './TeamPerformance.css';

const TeamPerformance = ({ user }) => {
  const dispatch = useAppDispatch();
  const { teamStats, performance, userRank } = useAppSelector((state) => state.mlmSystem);

  useEffect(() => {
    // Load team performance data
    const mockTeamStats = {
      totalTeamSize: 24,
      directReferrals: 8,
      activeMembers: 18,
      totalVolume: 15000,
      leftLegVolume: 8000,
      rightLegVolume: 7000,
      weakLeg: 'right',
      carryForward: 1000,
    };
    dispatch(updateTeamStats(mockTeamStats));

    const mockPerformance = {
      monthlyVolume: 5000,
      quarterlyVolume: 15000,
      yearlyVolume: 60000,
      personalVolume: 2000,
      teamVolume: 15000,
      growthRate: 15.5,
    };
    dispatch(updatePerformance(mockPerformance));
  }, [dispatch]);

  const performanceMetrics = [
    {
      label: 'Team Growth',
      value: teamStats.totalTeamSize,
      change: '+12%',
      trend: 'up',
      icon: <FaUsers />,
      color: '#6366f1',
    },
    {
      label: 'Active Members',
      value: teamStats.activeMembers,
      change: '+8%',
      trend: 'up',
      icon: <FaUsers />,
      color: 'var(--success-color, #10b981)',
    },
    {
      label: 'Team Volume',
      value: `$${teamStats.totalVolume.toLocaleString()}`,
      change: '+25%',
      trend: 'up',
      icon: <FaChartLine />,
      color: 'var(--warning-color, #f59e0b)',
    },
    {
      label: 'Personal Volume',
      value: `$${performance.personalVolume.toLocaleString()}`,
      change: '+15%',
      trend: 'up',
      icon: <FaTrophy />,
      color: '#ec4899',
    },
  ];

  const topPerformers = [
    { name: 'John Smith', volume: 5000, referrals: 12, rank: 'Gold' },
    { name: 'Jane Doe', volume: 3500, referrals: 8, rank: 'Silver' },
    { name: 'Bob Johnson', volume: 2800, referrals: 6, rank: 'Silver' },
    { name: 'Alice Williams', volume: 2200, referrals: 5, rank: 'Bronze' },
    { name: 'Charlie Brown', volume: 1800, referrals: 4, rank: 'Bronze' },
  ];

  return (
    <div className="team-performance">
      <div className="performance-header">
        <div>
          <h1>Team Performance</h1>
          <p>Track your team's growth and performance metrics</p>
        </div>
        <div className="rank-badge">
          <FaTrophy className="rank-icon" />
          <span>{userRank.name}</span>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="performance-metrics-grid">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="performance-metric-card">
            <div className="metric-header">
              <div className="metric-icon" style={{ background: `${metric.color}20`, color: metric.color }}>
                {metric.icon}
              </div>
              <div className={`metric-change ${metric.trend}`}>
                {metric.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                <span>{metric.change}</span>
              </div>
            </div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-label">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Volume Breakdown */}
      <div className="volume-breakdown">
        <h2>Volume Breakdown</h2>
        <div className="volume-grid">
          <div className="volume-card">
            <div className="volume-label">Monthly Volume</div>
            <div className="volume-value">${performance.monthlyVolume.toLocaleString()}</div>
            <div className="volume-progress">
              <div 
                className="volume-progress-bar" 
                style={{ width: `${(performance.monthlyVolume / 10000) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="volume-card">
            <div className="volume-label">Quarterly Volume</div>
            <div className="volume-value">${performance.quarterlyVolume.toLocaleString()}</div>
            <div className="volume-progress">
              <div 
                className="volume-progress-bar" 
                style={{ width: `${(performance.quarterlyVolume / 50000) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="volume-card">
            <div className="volume-label">Yearly Volume</div>
            <div className="volume-value">${performance.yearlyVolume.toLocaleString()}</div>
            <div className="volume-progress">
              <div 
                className="volume-progress-bar" 
                style={{ width: `${(performance.yearlyVolume / 200000) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="top-performers">
        <h2>Top Performers</h2>
        <div className="performers-table">
          <div className="table-header">
            <div className="table-cell">Rank</div>
            <div className="table-cell">Name</div>
            <div className="table-cell">Volume</div>
            <div className="table-cell">Referrals</div>
            <div className="table-cell">Rank</div>
          </div>
          {topPerformers.map((performer, index) => (
            <div key={index} className="table-row">
              <div className="table-cell rank-number" data-label="Rank">#{index + 1}</div>
              <div className="table-cell" data-label="Name">{performer.name}</div>
              <div className="table-cell" data-label="Volume">${performer.volume.toLocaleString()}</div>
              <div className="table-cell" data-label="Referrals">{performer.referrals}</div>
              <div className="table-cell" data-label="Rank">
                <span className="rank-badge-small">{performer.rank}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section-wrapper">
        <div className="charts-section-header">
          <h2>Performance Analytics</h2>
          <p>Visual insights into your team's growth and performance metrics</p>
        </div>
        <div className="charts-section">
          <div className="chart-wrapper">
            <TeamGrowthChart teamStats={teamStats} />
          </div>
          <div className="chart-wrapper">
            <VolumeTrendChart performance={performance} />
          </div>
          <div className="chart-wrapper">
            <PerformanceMetricsChart performance={performance} />
          </div>
          {(teamStats.leftLegVolume > 0 || teamStats.rightLegVolume > 0) && (
            <div className="chart-wrapper">
              <BinaryLegComparisonChart teamStats={teamStats} />
            </div>
          )}
        </div>
      </div>

      {/* Growth Chart */}
      <div className="growth-section">
        <h2>Growth Trends</h2>
        <div className="growth-stats">
          <div className="growth-item">
            <div className="growth-label">Growth Rate</div>
            <div className="growth-value positive">{performance.growthRate}%</div>
          </div>
          <div className="growth-item">
            <div className="growth-label">Team Size Growth</div>
            <div className="growth-value positive">+12%</div>
          </div>
          <div className="growth-item">
            <div className="growth-label">Volume Growth</div>
            <div className="growth-value positive">+25%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPerformance;
