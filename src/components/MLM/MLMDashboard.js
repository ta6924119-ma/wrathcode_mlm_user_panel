import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  updateTeamStats, 
  updatePerformance,    
  MLM_TYPES,
  RANKS 
} from '../../store/slices/mlmSystemSlice';
import { FaUsers, FaChartLine, FaTrophy, FaCoins, FaHandshake } from 'react-icons/fa';
import './MLMDashboard.css';

const MLMDashboard = ({ user }) => {
  const dispatch = useAppDispatch();
  const { 
    mlmType, 
    userRank, 
    teamStats,  
    commissions, 
    performance
  } = useAppSelector((state) => state.mlmSystem);

  useEffect(() => {
    // Load and calculate team stats
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

    // Calculate performance
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

  const stats = [
    {
      label: 'Total Team',
      value: teamStats.totalTeamSize,
      icon: <FaUsers />,
      color: '#6366f1',
      subLabel: `${teamStats.activeMembers} Active`,
    },
    {
      label: 'Direct Referrals',
      value: teamStats.directReferrals,
      icon: <FaHandshake />,
      color: '#10b981',
      subLabel: 'First Level',
    },
    {
      label: 'Total Volume',
      value: `$${teamStats.totalVolume.toLocaleString()}`,
      icon: <FaChartLine />,
      color: '#f59e0b',
      subLabel: `$${performance.monthlyVolume.toLocaleString()} This Month`,
    },
    {
      label: 'Total Commissions',
      value: `$${commissions.total.toFixed(2)}`,
      icon: <FaCoins />,
      color: '#ec4899',
      subLabel: `${commissions.directReferral > 0 ? `Direct: $${commissions.directReferral.toFixed(2)}` : 'No commissions yet'}`,
    },
  ];

  const binaryStats = mlmType === MLM_TYPES.BINARY ? [
    {
      label: 'Left Leg',
      value: `$${teamStats.leftLegVolume.toLocaleString()}`,
      color: '#10b981',
    },
    {
      label: 'Right Leg',
      value: `$${teamStats.rightLegVolume.toLocaleString()}`,
      color: '#ef4444',
    },
    {
      label: 'Weak Leg',
      value: teamStats.weakLeg === 'left' ? 'Left' : 'Right',
      color: '#f59e0b',
    },
    {
      label: 'Carry Forward',
      value: `$${teamStats.carryForward.toLocaleString()}`,
      color: '#6366f1',
    },
  ] : null;
  
  const commissionBreakdown = [
    { type: 'Direct Referral', amount: commissions.directReferral, color: '#6366f1' },
    { type: 'Level Commissions', amount: commissions.levelCommissions, color: '#10b981' },
    { type: 'Binary Pairing', amount: commissions.binaryPairing, color: '#f59e0b' },
    { type: 'Matrix Bonus', amount: commissions.matrixBonus, color: '#8b5cf6' },
    { type: 'Matching Bonus', amount: commissions.matchingBonus, color: '#ec4899' },
    { type: 'Leadership Bonus', amount: commissions.leadershipBonus, color: '#06b6d4' },
    { type: 'Rank Bonus', amount: commissions.rankBonus, color: '#fbbf24' },
    { type: 'Fast Start Bonus', amount: commissions.fastStartBonus || 0, color: '#10b981' },
    { type: 'Infinity Bonus', amount: commissions.infinityBonus || 0, color: '#8b5cf6' },
    { type: 'Power Bonus', amount: commissions.powerBonus || 0, color: '#ec4899' },
    { type: 'Team Bonus', amount: commissions.teamBonus || 0, color: '#6366f1' },
    { type: 'Override Bonus', amount: commissions.overrideBonus || 0, color: '#f59e0b' },
    { type: 'Performance Bonus', amount: commissions.performanceBonus, color: '#06b6d4' },
    { type: 'Royalty Bonus', amount: commissions.royaltyBonus, color: '#ec4899' },
  ].filter(item => item.amount > 0);

  return (
    <div className="mlm-dashboard">
      <div className="mlm-dashboard-header">
        <div>
          <h1>MLM System Dashboard</h1>
          <p>Advanced Multi-Level Marketing Platform</p>
        </div>
        <div className="mlm-type-badge">
          <span className="mlm-type-label">MLM Type:</span>
          <span className="mlm-type-value">{mlmType.toUpperCase()}</span>
        </div>
      </div>

      {/* Rank Display */}
      <div className="rank-display">
        <div className="rank-card">
          <FaTrophy className="rank-icon" style={{ color: userRank.bonus > 0 ? '#fbbf24' : '#6366f1' }} />
          <div className="rank-info">
            <div className="rank-name">{userRank.name}</div>
            <div className="rank-bonus">Bonus: {userRank.bonus}%</div>
          </div>
          <div className="rank-progress">
            <div className="progress-label">
              Next Rank: {(() => {
                const nextRank = Object.values(RANKS).find(r => r.id === userRank.id + 1);
                return nextRank ? nextRank.name : 'Max';
              })()}
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: (() => {
                    const nextRank = Object.values(RANKS).find(r => r.id === userRank.id + 1);
                    const minTeam = nextRank ? nextRank.minTeam : 1;
                    const progress = Math.min((teamStats.totalTeamSize / minTeam) * 100, 100);
                    return `${progress}%`;
                  })()
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="mlm-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="mlm-stat-card">
            <div className="stat-icon-wrapper" style={{ background: `${stat.color}20`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-sublabel">{stat.subLabel}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Binary Stats (if Binary MLM) */}
      {binaryStats && (
        <div className="binary-stats-section">
          <h2>Binary Leg Statistics</h2>
          <div className="binary-stats-grid">
            {binaryStats.map((stat, index) => (
              <div key={index} className="binary-stat-card">
                <div className="binary-stat-label">{stat.label}</div>
                <div className="binary-stat-value" style={{ color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Commission Breakdown */}
      {commissionBreakdown.length > 0 && (
        <div className="commission-breakdown-section">
          <h2>Commission Breakdown</h2>
          <div className="commission-breakdown-grid">
            {commissionBreakdown.map((item, index) => (
              <div key={index} className="commission-item">
                <div className="commission-type">
                  <div className="commission-color-dot" style={{ background: item.color }}></div>
                  <span>{item.type}</span>
                </div>
                <div className="commission-amount">${item.amount.toFixed(2)}</div>
              </div>
            ))}
            <div className="commission-total">
              <div className="commission-type">
                <span>Total Commissions</span>
              </div>
              <div className="commission-amount total">${commissions.total.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Features Section */}
      <div className="advanced-features-section">
        <h2>Advanced Features & Analytics</h2>
        <div className="advanced-features-grid">
          <div className="advanced-feature-card">
            <h3>Cycle Performance</h3>
            <div className="cycle-stats">
              <div className="cycle-stat-item">
                <span className="cycle-label">Daily Total</span>
                <span className="cycle-value">${(commissions.dailyTotal || 0).toFixed(2)}</span>
              </div>
              <div className="cycle-stat-item">
                <span className="cycle-label">Weekly Total</span>
                <span className="cycle-value">${(commissions.weeklyTotal || 0).toFixed(2)}</span>
              </div>
              <div className="cycle-stat-item">
                <span className="cycle-label">Monthly Total</span>
                <span className="cycle-value">${(commissions.monthlyTotal || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>


          {/* Team Analytics */}
          <div className="advanced-feature-card">
            <h3>Team Analytics</h3>
            <div className="analytics-stats">
              <div className="analytics-item">
                <span className="analytics-label">Team Depth</span>
                <span className="analytics-value">{teamStats.teamDepth || 0} Levels</span>
              </div>
              <div className="analytics-item">
                <span className="analytics-label">Team Width</span>
                <span className="analytics-value">{teamStats.teamWidth || 0} Members</span>
              </div>
              <div className="analytics-item">
                <span className="analytics-label">Avg Order Value</span>
                <span className="analytics-value">${(teamStats.averageOrderValue || 0).toFixed(2)}</span>
              </div>
              <div className="analytics-item">
                <span className="analytics-label">Conversion Rate</span>
                <span className="analytics-value">{(teamStats.conversionRate || 0).toFixed(1)}%</span>
              </div>
            </div>
          </div>
          
          <div className="advanced-feature-card">
            <h3>Volume Breakdown</h3>
            <div className="volume-stats">
              <div className="volume-item">
                <span className="volume-label">Daily Volume</span>
                <span className="volume-value">${(teamStats.dailyVolume || 0).toLocaleString()}</span>
              </div>
              <div className="volume-item">
                <span className="volume-label">Weekly Volume</span>
                <span className="volume-value">${(teamStats.weeklyVolume || 0).toLocaleString()}</span>
              </div>
              <div className="volume-item">
                <span className="volume-label">Monthly Volume</span>
                <span className="volume-value">${(teamStats.monthlyVolume || 0).toLocaleString()}</span>
              </div>
              {teamStats.compressedVolume > 0 && (
                <div className="volume-item">
                  <span className="volume-label">Compressed Volume</span>
                  <span className="volume-value">${teamStats.compressedVolume.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
          
          {teamStats.spilloverCount > 0 && (
            <div className="advanced-feature-card">
              <h3>Matrix Features</h3>
              <div className="matrix-stats">
                <div className="matrix-item">
                  <span className="matrix-label">Spillovers</span>
                  <span className="matrix-value">{teamStats.spilloverCount}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      
        
      <div className="performance-section">
        <h2>Performance Metrics</h2>
        <div className="performance-grid">
          <div className="performance-card">
            
            <div className="performance-label">Monthly Volume</div>
            <div className="performance-value">${performance.monthlyVolume.toLocaleString()}</div>
          </div>
          <div className="performance-card">
            <div className="performance-label">Quarterly Volume</div>
            <div className="performance-value">${performance.quarterlyVolume.toLocaleString()}</div>
          </div>
          <div className="performance-card">
            <div className="performance-label">Yearly Volume</div>
            <div className="performance-value">${performance.yearlyVolume.toLocaleString()}</div>
          </div>
          <div className="performance-card">
            <div className="performance-label">Growth Rate</div>
            <div className="performance-value" style={{ color: performance.growthRate > 0 ? '#10b981' : '#ef4444' }}>
              {performance.growthRate > 0 ? '+' : ''}{performance.growthRate}%
            </div>

 
          </div>
          
        </div>
        
      </div>
   
    </div>
  );
};

export default MLMDashboard;
