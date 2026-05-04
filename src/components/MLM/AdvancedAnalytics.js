import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { RANKS } from '../../store/slices/mlmSystemSlice';
import { FaChartLine, FaBrain, FaLightbulb, FaArrowUp, FaArrowDown, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { 
  VolumeTrendChart, 
  TeamGrowthChart, 
  PerformanceMetricsChart,
  CommissionTrendChart 
} from '../Charts/ReportsCharts';
import './AdvancedAnalytics.css';

const AdvancedAnalytics = ({ user }) => {
  const { teamStats, commissions, performance, userRank } = useAppSelector((state) => state.mlmSystem);
  const [analyticsType, setAnalyticsType] = useState('overview'); // overview, predictions, insights, trends

  // Mock AI predictions and insights
  const [predictions, setPredictions] = useState({
    nextMonthVolume: 0,
    nextMonthCommissions: 0,
    rankAdvancement: null,
    growthForecast: 0,
    riskFactors: [],
    opportunities: [],
  });

  const [insights, setInsights] = useState([]);
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    // Calculate predictions based on current data
    const calculatePredictions = () => {
      const growthRate = performance?.growthRate || 0;
      const currentVolume = performance?.monthlyVolume || 0;
      const currentCommissions = commissions?.monthlyTotal || 0;

      const nextMonthVolume = currentVolume * (1 + growthRate / 100);
      const nextMonthCommissions = currentCommissions * (1 + growthRate / 100);

      // Rank advancement prediction
      const nextRank = Object.values(RANKS).find(r => r.id === (userRank?.id || 0) + 1);
      const rankAdvancement = nextRank ? {
        rank: nextRank.name,
        estimatedDays: Math.ceil(((nextRank?.minTeam || 0) - (teamStats?.totalTeamSize || 0)) / ((teamStats?.totalTeamSize || 1) * 0.1)),
        progress: (((teamStats?.totalTeamSize || 0) / (nextRank?.minTeam || 1)) * 100).toFixed(1),
      } : null;

      // Risk factors
      const riskFactors = [];
      if ((teamStats?.activeMembers || 0) / (teamStats?.totalTeamSize || 1) < 0.7) {
        riskFactors.push({
          type: 'warning',
          title: 'Low Active Member Ratio',
          description: `Only ${(((teamStats?.activeMembers || 0) / (teamStats?.totalTeamSize || 1)) * 100).toFixed(1)}% of your team is active. Focus on engagement.`,
        });
      }
      if ((performance?.growthRate || 0) < 0) {
        riskFactors.push({
          type: 'danger',
          title: 'Negative Growth Rate',
          description: 'Your growth rate is negative. Review your strategies.',
        });
      }
      if ((teamStats?.directReferrals || 0) < 3) {
        riskFactors.push({
          type: 'warning',
          title: 'Low Direct Referrals',
          description: 'Consider increasing your referral efforts.',
        });
      }

      // Opportunities
      const opportunities = [];
      if ((teamStats?.leftLegVolume || 0) !== (teamStats?.rightLegVolume || 0)) {
        opportunities.push({
          type: 'success',
          title: 'Balance Binary Legs',
          description: `Your legs are imbalanced. Balancing them could increase commissions by ${Math.abs((teamStats?.leftLegVolume || 0) - (teamStats?.rightLegVolume || 0)) * 0.1}%.`,
        });
      }
      if ((teamStats?.totalTeamSize || 0) < 10) {
        opportunities.push({
          type: 'info',
          title: 'Fast Start Bonus Available',
          description: 'You can still earn fast start bonuses for new referrals.',
        });
      }
      if ((userRank?.id || 0) < 4) {
        opportunities.push({
          type: 'success',
          title: 'Rank Advancement Opportunity',
          description: `You're ${(((teamStats?.totalTeamSize || 0) / (nextRank?.minTeam || 1)) * 100).toFixed(1)}% towards ${nextRank?.name || 'next'} rank.`,
        });
      }

      setPredictions({
        nextMonthVolume,
        nextMonthCommissions,
        rankAdvancement,
        growthForecast: growthRate,
        riskFactors,
        opportunities,
      });
    };

    // Generate insights
    const generateInsights = () => {
      const insightsList = [
        {
          type: 'success',
          icon: <FaArrowUp />,
          title: 'Strong Growth Trend',
          description: `Your team has grown by ${performance?.growthRate || 0}% this month. Keep up the momentum!`,
          impact: 'high',
          action: 'Continue current strategies',
        },
        {
          type: 'info',
          icon: <FaChartLine />,
          title: 'Commission Optimization',
          description: `You're earning ${(((commissions?.directReferral || 0) / (commissions?.total || 1)) * 100).toFixed(1)}% from direct referrals. Consider building deeper levels.`,
          impact: 'medium',
          action: 'Focus on level building',
        },
        {
          type: 'warning',
          icon: <FaExclamationTriangle />,
          title: 'Team Engagement',
          description: `${teamStats.inactiveMembers || 0} members are inactive. Re-engage them to boost volume.`,
          impact: 'high',
          action: 'Launch engagement campaign',
        },
      ];
      setInsights(insightsList);
    };

    // Generate trends
    const generateTrends = () => {
      const trendsList = [
        {
          metric: 'Team Size',
          trend: 'up',
          change: '+12%',
          period: 'Last 30 days',
          value: teamStats?.totalTeamSize || 0,
        },
        {
          metric: 'Monthly Volume',
          trend: 'up',
          change: `+${performance?.growthRate || 0}%`,
          period: 'Last 30 days',
          value: `$${(performance?.monthlyVolume || 0).toLocaleString()}`,
        },
        {
          metric: 'Active Members',
          trend: ((teamStats?.activeMembers || 0) / (teamStats?.totalTeamSize || 1)) > 0.7 ? 'up' : 'down',
          change: `${(((teamStats?.activeMembers || 0) / (teamStats?.totalTeamSize || 1)) * 100).toFixed(1)}%`,
          period: 'Current',
          value: teamStats?.activeMembers || 0,
        },
        {
          metric: 'Commission Rate',
          trend: 'up',
          change: '+5.2%',
          period: 'Last 30 days',
          value: `${(((commissions?.total || 0) / (performance?.monthlyVolume || 1)) * 100).toFixed(2)}%`,
        },
      ];
      setTrends(trendsList);
    };

    calculatePredictions();
    generateInsights();
    generateTrends();
  }, [teamStats, commissions, performance, userRank]);

  const analyticsTypes = [
    { id: 'overview', label: 'Overview', icon: <FaChartLine /> },
    { id: 'predictions', label: 'AI Predictions', icon: <FaBrain /> },
    { id: 'insights', label: 'Insights', icon: <FaLightbulb /> },
    { id: 'trends', label: 'Trends', icon: <FaArrowUp /> },
  ];

  return (
    <div className="advanced-analytics">
      <div className="analytics-header">
        <div>
          <h1><FaBrain /> Advanced Analytics & AI Insights</h1>
          <p>Data-driven insights and predictions for your MLM business</p>
        </div>
      </div>

      {/* Analytics Type Tabs */}
      <div className="analytics-tabs">
        {analyticsTypes.map((type) => (
          <button
            key={type.id}
            className={`analytics-tab ${analyticsType === type.id ? 'active' : ''}`}
            onClick={() => setAnalyticsType(type.id)}
          >
            {type.icon}
            <span>{type.label}</span>
          </button>
        ))}
      </div>

      {/* Overview */}
      {analyticsType === 'overview' && (
        <div className="analytics-content">
          <div className="analytics-overview-grid">
            <div className="overview-card">
              <h3>Key Metrics</h3>
              <div className="metrics-grid">
                <div className="metric-item">
                  <div className="metric-label">Team Growth Rate</div>
                  <div className="metric-value positive">{performance.growthRate}%</div>
                </div>
                <div className="metric-item">
                  <div className="metric-label">Active Member Ratio</div>
                  <div className="metric-value">
                    {((teamStats.activeMembers / teamStats.totalTeamSize) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="metric-item">
                  <div className="metric-label">Commission Efficiency</div>
                  <div className="metric-value">
                    {((commissions.total / performance.monthlyVolume) * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="metric-item">
                  <div className="metric-label">Team Depth</div>
                  <div className="metric-value">{teamStats.teamDepth || 0} Levels</div>
                </div>
              </div>
            </div>

            <div className="overview-card">
              <h3>Performance Score</h3>
              <div className="performance-score">
                <div className="score-circle">
                  <div className="score-value">85</div>
                  <div className="score-label">Overall Score</div>
                </div>
                <div className="score-breakdown">
                  <div className="score-item">
                    <span>Team Building</span>
                    <span className="score-bar">
                      <div className="score-fill" style={{ width: '90%' }}></div>
                    </span>
                    <span>90%</span>
                  </div>
                  <div className="score-item">
                    <span>Volume Generation</span>
                    <span className="score-bar">
                      <div className="score-fill" style={{ width: '75%' }}></div>
                    </span>
                    <span>75%</span>
                  </div>
                  <div className="score-item">
                    <span>Engagement</span>
                    <span className="score-bar">
                      <div className="score-fill" style={{ width: '80%' }}></div>
                    </span>
                    <span>80%</span>
                  </div>
                  <div className="score-item">
                    <span>Retention</span>
                    <span className="score-bar">
                      <div className="score-fill" style={{ width: '85%' }}></div>
                    </span>
                    <span>85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="charts-section">
            <div className="chart-card">
              <h3>Volume Trends</h3>
              <VolumeTrendChart performance={performance} />
            </div>
            <div className="chart-card">
              <h3>Team Growth</h3>
              <TeamGrowthChart teamStats={teamStats} />
            </div>
            <div className="chart-card">
              <h3>Performance Metrics</h3>
              <PerformanceMetricsChart performance={performance} />
            </div>
            <div className="chart-card">
              <h3>Commission Trends</h3>
              <CommissionTrendChart commissions={commissions} />
            </div>
          </div>
        </div>
      )}

      {/* AI Predictions */}
      {analyticsType === 'predictions' && (
        <div className="analytics-content">
          <div className="predictions-grid">
            <div className="prediction-card">
              <h3><FaBrain /> Next Month Forecast</h3>
              <div className="prediction-item">
                <div className="prediction-label">Predicted Volume</div>
                <div className="prediction-value">
                  ${predictions.nextMonthVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="prediction-change positive">
                  +{performance.growthRate}% from current
                </div>
              </div>
              <div className="prediction-item">
                <div className="prediction-label">Predicted Commissions</div>
                <div className="prediction-value">
                  ${predictions.nextMonthCommissions.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="prediction-change positive">
                  +{performance.growthRate}% from current
                </div>
              </div>
            </div>

            {predictions.rankAdvancement && (
              <div className="prediction-card">
                <h3><FaArrowUp /> Rank Advancement</h3>
                <div className="rank-prediction">
                  <div className="current-rank">Current: {userRank.name}</div>
                  <div className="next-rank">Next: {predictions.rankAdvancement.rank}</div>
                  <div className="rank-progress">
                    <div className="progress-label">Progress: {predictions.rankAdvancement.progress}%</div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${predictions.rankAdvancement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="estimated-time">
                    Estimated time to reach: {predictions.rankAdvancement.estimatedDays} days
                  </div>
                </div>
              </div>
            )}

            <div className="prediction-card">
              <h3><FaExclamationTriangle /> Risk Factors</h3>
              {predictions.riskFactors.length > 0 ? (
                <div className="risk-list">
                  {predictions.riskFactors.map((risk, index) => (
                    <div key={index} className={`risk-item ${risk.type}`}>
                      <div className="risk-icon">
                        {risk.type === 'danger' ? <FaExclamationTriangle /> : <FaExclamationTriangle />}
                      </div>
                      <div className="risk-content">
                        <div className="risk-title">{risk.title}</div>
                        <div className="risk-description">{risk.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-risks">
                  <FaCheckCircle />
                  <span>No significant risk factors detected</span>
                </div>
              )}
            </div>

            <div className="prediction-card">
              <h3><FaLightbulb /> Opportunities</h3>
              {predictions.opportunities.length > 0 ? (
                <div className="opportunities-list">
                  {predictions.opportunities.map((opp, index) => (
                    <div key={index} className={`opportunity-item ${opp.type}`}>
                      <div className="opportunity-icon">
                        {opp.type === 'success' ? <FaArrowUp /> : <FaLightbulb />}
                      </div>
                      <div className="opportunity-content">
                        <div className="opportunity-title">{opp.title}</div>
                        <div className="opportunity-description">{opp.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-opportunities">
                  <span>No new opportunities at this time</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Insights */}
      {analyticsType === 'insights' && (
        <div className="analytics-content">
          <div className="insights-grid">
            {insights.map((insight, index) => (
              <div key={index} className={`insight-card ${insight.type}`}>
                <div className="insight-header">
                  <div className="insight-icon">{insight.icon}</div>
                  <div className="insight-title">{insight.title}</div>
                  <div className={`impact-badge ${insight.impact}`}>
                    {insight.impact} impact
                  </div>
                </div>
                <div className="insight-description">{insight.description}</div>
                <div className="insight-action">
                  <FaCheckCircle />
                  <span>Recommended: {insight.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trends */}
      {analyticsType === 'trends' && (
        <div className="analytics-content">
          <div className="trends-grid">
            {trends.map((trend, index) => (
              <div key={index} className="trend-card">
                <div className="trend-header">
                  <div className="trend-metric">{trend.metric}</div>
                  <div className={`trend-indicator ${trend.trend}`}>
                    {trend.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                  </div>
                </div>
                <div className="trend-value">{trend.value}</div>
                <div className="trend-change positive">{trend.change}</div>
                <div className="trend-period">{trend.period}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedAnalytics;
