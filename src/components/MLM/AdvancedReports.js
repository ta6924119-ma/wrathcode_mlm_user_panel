import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateTeamStats, updatePerformance, RANKS } from '../../store/slices/mlmSystemSlice';
import { FaFileAlt, FaDownload, FaChartBar, FaTable } from 'react-icons/fa';
import { 
  CommissionBreakdownPieChart, 
  VolumeTrendChart, 
  TeamGrowthChart, 
  PerformanceMetricsChart,
  CommissionTrendChart 
} from '../Charts/ReportsCharts';
import './AdvancedReports.css';

const AdvancedReports = ({ user }) => {
  const dispatch = useAppDispatch();
  const { teamStats, performance, commissions, userRank } = useAppSelector((state) => state.mlmSystem);
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [reportPeriod, setReportPeriod] = useState('monthly'); // daily, weekly, monthly

  useEffect(() => {
    // Load data
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

  const reportTypes = [
    { id: 'overview', label: 'Overview', icon: <FaChartBar /> },
    { id: 'commissions', label: 'Commissions', icon: <FaTable /> },
    { id: 'team', label: 'Team Report', icon: <FaFileAlt /> },
    { id: 'performance', label: 'Performance', icon: <FaChartBar /> },
  ];

  const exportReport = () => {
    // Export report functionality
    console.log('Exporting report');
  };

  return (
    <div className="advanced-reports">
      <div className="reports-header">
        <div>
          <h1><FaFileAlt /> Advanced Reports</h1>
          <p>Generate detailed reports and analytics for your MLM business</p>
        </div>
        <div className="header-actions">
          <div className="filter-group">
            <label>Period:</label>
            <select 
              className="period-select"
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Range:</label>
            <select 
              className="date-range-select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <button className="export-button" onClick={exportReport}>
            <FaDownload /> Export
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="report-tabs">
        {reportTypes.map((type) => (
          <button
            key={type.id}
            className={`report-tab ${reportType === type.id ? 'active' : ''}`}
            onClick={() => setReportType(type.id)}
          >
            {type.icon}
            <span>{type.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Report */}
      {reportType === 'overview' && (
        <div className="report-content">
          <div className="report-section">
            <h2>Business Overview</h2>
            <div className="overview-grid">
              <div className="overview-card">
                <div className="overview-label">Total Team Size</div>
                <div className="overview-value">{teamStats.totalTeamSize}</div>
                <div className="overview-change positive">+12% from last period</div>
              </div>
              <div className="overview-card">
                <div className="overview-label">Total Volume</div>
                <div className="overview-value">${teamStats.totalVolume.toLocaleString()}</div>
                <div className="overview-change positive">+25% from last period</div>
              </div>
              <div className="overview-card">
                <div className="overview-label">Total Commissions</div>
                <div className="overview-value">${commissions.total.toFixed(2)}</div>
                <div className="overview-change positive">+18% from last period</div>
              </div>
              <div className="overview-card">
                <div className="overview-label">Current Rank</div>
                <div className="overview-value">{userRank?.name || 'Starter'}</div>
                <div className="overview-change">
                  Next: {(() => {
                    const nextRank = Object.values(RANKS).find(r => r.id === (userRank?.id || 0) + 1);
                    return nextRank ? nextRank.name : 'Max';
                  })()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Charts Section */}
          <div className="report-section">
            <div className="reports-charts-grid">
              <VolumeTrendChart performance={performance} />
              <TeamGrowthChart teamStats={teamStats} />
            </div>
          </div>
        </div>
      )}

      {/* Commissions Report */}
      {reportType === 'commissions' && (
        <div className="report-content">
          <div className="report-section">
            <h2>Commission Breakdown</h2>
            <div className="commission-report-table">
              <div className="table-header">
                <div className="table-cell">Type</div>
                <div className="table-cell">Amount</div>
                <div className="table-cell">Percentage</div>
                <div className="table-cell">Status</div>
              </div>
              <div className="table-row">
                <div className="table-cell" data-label="Type">Direct Referral</div>
                <div className="table-cell" data-label="Amount">${commissions.directReferral.toFixed(2)}</div>
                <div className="table-cell" data-label="Percentage">{((commissions.directReferral / commissions.total) * 100).toFixed(1)}%</div>
                <div className="table-cell status-paid" data-label="Status">Paid</div>
              </div>
              <div className="table-row">
                <div className="table-cell" data-label="Type">Level Commissions</div>
                <div className="table-cell" data-label="Amount">${commissions.levelCommissions.toFixed(2)}</div>
                <div className="table-cell" data-label="Percentage">{((commissions.levelCommissions / commissions.total) * 100).toFixed(1)}%</div>
                <div className="table-cell status-paid" data-label="Status">Paid</div>
              </div>
              <div className="table-row">
                <div className="table-cell" data-label="Type">Binary Pairing</div>
                <div className="table-cell" data-label="Amount">${commissions.binaryPairing.toFixed(2)}</div>
                <div className="table-cell" data-label="Percentage">{((commissions.binaryPairing / commissions.total) * 100).toFixed(1)}%</div>
                <div className="table-cell status-pending" data-label="Status">Pending</div>
              </div>
              <div className="table-row">
                <div className="table-cell" data-label="Type">Matching Bonus</div>
                <div className="table-cell" data-label="Amount">${commissions.matchingBonus.toFixed(2)}</div>
                <div className="table-cell" data-label="Percentage">{((commissions.matchingBonus / commissions.total) * 100).toFixed(1)}%</div>
                <div className="table-cell status-paid" data-label="Status">Paid</div>
              </div>
              <div className="table-row total">
                <div className="table-cell" data-label="Type">Total</div>
                <div className="table-cell" data-label="Amount">${commissions.total.toFixed(2)}</div>
                <div className="table-cell" data-label="Percentage">100%</div>
                <div className="table-cell" data-label="Status">-</div>
              </div>
            </div>
          </div>
          
          {/* Charts Section */}
          <div className="report-section">
            <div className="reports-charts-grid">
              <CommissionBreakdownPieChart commissions={commissions} />
              <CommissionTrendChart commissions={commissions} />
            </div>
          </div>
        </div>
      )}

      {/* Team Report */}
      {reportType === 'team' && (
        <div className="report-content">
          <div className="report-section">
            <h2>Team Statistics</h2>
            <div className="team-report-grid">
              <div className="team-stat-card">
                <div className="team-stat-label">Direct Referrals</div>
                <div className="team-stat-value">{teamStats.directReferrals}</div>
                <div className="team-stat-detail">First level members</div>
              </div>
              <div className="team-stat-card">
                <div className="team-stat-label">Active Members</div>
                <div className="team-stat-value">{teamStats.activeMembers}</div>
                <div className="team-stat-detail">Out of {teamStats.totalTeamSize} total</div>
              </div>
              <div className="team-stat-card">
                <div className="team-stat-label">Team Volume</div>
                <div className="team-stat-value">${teamStats.totalVolume.toLocaleString()}</div>
                <div className="team-stat-detail">Total team sales volume</div>
              </div>
              <div className="team-stat-card">
                <div className="team-stat-label">Average per Member</div>
                <div className="team-stat-value">${Math.round(teamStats.totalVolume / teamStats.totalTeamSize).toLocaleString()}</div>
                <div className="team-stat-detail">Average volume per team member</div>
              </div>
            </div>
          </div>
          
          {/* Charts Section */}
          <div className="report-section">
            <TeamGrowthChart teamStats={teamStats} />
          </div>
        </div>
      )}

      {/* Performance Report */}
      {reportType === 'performance' && (
        <div className="report-content">
          <div className="report-section">
            <h2>Performance Metrics</h2>
            <div className="performance-report-grid">
              <div className="performance-metric-card">
                <div className="metric-label">Monthly Volume</div>
                <div className="metric-value">${performance.monthlyVolume.toLocaleString()}</div>
                <div className="metric-trend positive">↑ +15%</div>
              </div>
              <div className="performance-metric-card">
                <div className="metric-label">Quarterly Volume</div>
                <div className="metric-value">${performance.quarterlyVolume.toLocaleString()}</div>
                <div className="metric-trend positive">↑ +22%</div>
              </div>
              <div className="performance-metric-card">
                <div className="metric-label">Yearly Volume</div>
                <div className="metric-value">${performance.yearlyVolume.toLocaleString()}</div>
                <div className="metric-trend positive">↑ +18%</div>
              </div>
              <div className="performance-metric-card">
                <div className="metric-label">Growth Rate</div>
                <div className="metric-value">{performance.growthRate}%</div>
                <div className="metric-trend positive">↑ +3.5%</div>
              </div>
            </div>
          </div>
          
          {/* Charts Section */}
          <div className="report-section">
            <div className="reports-charts-grid">
              <PerformanceMetricsChart performance={performance} />
              <VolumeTrendChart performance={performance} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedReports;
