import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { FaTrophy, FaMedal, FaCrown, FaFire, FaArrowUp, FaArrowDown, FaUsers, FaCoins, FaChartLine } from 'react-icons/fa';
import './AdvancedLeaderboard.css';

const AdvancedLeaderboard = ({ user }) => {
  const { teamStats, commissions, userRank, performance } = useAppSelector((state) => state.mlmSystem);
  const [leaderboardType, setLeaderboardType] = useState('overall'); // overall, monthly, weekly, daily
  const [category, setCategory] = useState('volume'); // volume, referrals, commissions, growth

  // Mock leaderboard data - in production, this would come from API
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    // Generate mock leaderboard data
    const generateLeaderboard = () => {
      const data = [];
      const names = ['John Smith', 'Jane Doe', 'Bob Johnson', 'Alice Williams', 'Charlie Brown', 'Diana Prince', 'Ethan Hunt', 'Fiona Apple', 'George Lucas', 'Hannah Montana'];
      
      for (let i = 0; i < 20; i++) {
        const isCurrentUser = i === 5; // Position 6 is current user
        data.push({
          id: i + 1,
          rank: i + 1,
          name: isCurrentUser ? user?.name || 'You' : names[i % names.length],
          userId: isCurrentUser ? user?.id : `user_${i + 1}`,
          volume: Math.floor(Math.random() * 50000) + 5000,
          referrals: Math.floor(Math.random() * 100) + 5,
          commissions: Math.floor(Math.random() * 10000) + 500,
          growth: (Math.random() * 50 - 10).toFixed(1),
          rankName: ['Starter', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'][Math.floor(Math.random() * 6)],
          isCurrentUser,
          change: Math.floor(Math.random() * 5) - 2, // Position change
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(isCurrentUser ? user?.name || 'You' : names[i % names.length])}&background=6366f1&color=fff`,
        });
      }
      
      // Sort by selected category
      data.sort((a, b) => {
        switch (category) {
          case 'volume':
            return b.volume - a.volume;
          case 'referrals':
            return b.referrals - a.referrals;
          case 'commissions':
            return b.commissions - a.commissions;
          case 'growth':
            return parseFloat(b.growth) - parseFloat(a.growth);
          default:
            return a.rank - b.rank;
        }
      });
      
      // Reassign ranks after sorting
      data.forEach((item, index) => {
        item.rank = index + 1;
      });
      
      return data;
    };

    setLeaderboardData(generateLeaderboard());
  }, [category, user]);

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaCrown className="rank-icon gold" />;
    if (rank === 2) return <FaMedal className="rank-icon silver" />;
    if (rank === 3) return <FaMedal className="rank-icon bronze" />;
    return <span className="rank-number">{rank}</span>;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'var(--warning-color, #fbbf24)';
    if (rank === 2) return 'var(--card-text, #9ca3af)';
    if (rank === 3) return '#cd7f32';
    return 'var(--primary-color, #6366f1)';
  };

  const categories = [
    { id: 'volume', label: 'Volume', icon: <FaChartLine /> },
    { id: 'referrals', label: 'Referrals', icon: <FaUsers /> },
    { id: 'commissions', label: 'Commissions', icon: <FaCoins /> },
    { id: 'growth', label: 'Growth', icon: <FaFire /> },
  ];

  const periods = [
    { id: 'overall', label: 'All Time' },
    { id: 'monthly', label: 'This Month' },
    { id: 'weekly', label: 'This Week' },
    { id: 'daily', label: 'Today' },
  ];

  const topThree = leaderboardData.slice(0, 3);
  const restOfLeaderboard = leaderboardData.slice(3);

  return (
    <div className="advanced-leaderboard">
      <div className="leaderboard-header">
        <div>
          <h1><FaTrophy /> Advanced Leaderboard</h1>
          <p>Compete with top performers and track your rankings</p>
        </div>
        <div className="user-rank-badge">
          <FaTrophy />
          <span>Your Rank: #{(leaderboardData.findIndex(u => u.isCurrentUser) + 1) || 'N/A'}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="leaderboard-filters">
        <div className="filter-group">
          <label>Category:</label>
          <div className="category-buttons">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-btn ${category === cat.id ? 'active' : ''}`}
                onClick={() => setCategory(cat.id)}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <label>Period:</label>
          <div className="period-buttons">
            {periods.map((period) => (
              <button
                key={period.id}
                className={`period-btn ${leaderboardType === period.id ? 'active' : ''}`}
                onClick={() => setLeaderboardType(period.id)}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      {topThree.length >= 3 && (
        <div className="podium-section">
          <div className="podium-container">
            {/* 2nd Place */}
            <div className="podium-item second">
              <div className="podium-avatar">
                <img src={topThree[1].avatar} alt={topThree[1].name} />
                <div className="podium-medal silver">2</div>
              </div>
              <div className="podium-name">{topThree[1].name}</div>
              <div className="podium-value">
                {category === 'volume' && `$${topThree[1].volume.toLocaleString()}`}
                {category === 'referrals' && `${topThree[1].referrals} Referrals`}
                {category === 'commissions' && `$${topThree[1].commissions.toLocaleString()}`}
                {category === 'growth' && `${topThree[1].growth}%`}
              </div>
              <div className="podium-rank">{topThree[1].rankName}</div>
            </div>

            {/* 1st Place */}
            <div className="podium-item first">
              <div className="podium-crown">
                <FaCrown />
              </div>
              <div className="podium-avatar">
                <img src={topThree[0].avatar} alt={topThree[0].name} />
                <div className="podium-medal gold">1</div>
              </div>
              <div className="podium-name">{topThree[0].name}</div>
              <div className="podium-value">
                {category === 'volume' && `$${topThree[0].volume.toLocaleString()}`}
                {category === 'referrals' && `${topThree[0].referrals} Referrals`}
                {category === 'commissions' && `$${topThree[0].commissions.toLocaleString()}`}
                {category === 'growth' && `${topThree[0].growth}%`}
              </div>
              <div className="podium-rank">{topThree[0].rankName}</div>
            </div>

            {/* 3rd Place */}
            <div className="podium-item third">
              <div className="podium-avatar">
                <img src={topThree[2].avatar} alt={topThree[2].name} />
                <div className="podium-medal bronze">3</div>
              </div>
              <div className="podium-name">{topThree[2].name}</div>
              <div className="podium-value">
                {category === 'volume' && `$${topThree[2].volume.toLocaleString()}`}
                {category === 'referrals' && `${topThree[2].referrals} Referrals`}
                {category === 'commissions' && `$${topThree[2].commissions.toLocaleString()}`}
                {category === 'growth' && `${topThree[2].growth}%`}
              </div>
              <div className="podium-rank">{topThree[2].rankName}</div>
            </div>
          </div>
        </div>
      )}

      {/* Rest of Leaderboard */}
      <div className="leaderboard-table-section">
        <h2>Full Leaderboard</h2>
        <div className="leaderboard-table">
          <div className="table-header">
            <div className="table-cell rank-col">Rank</div>
            <div className="table-cell name-col">Member</div>
            <div className="table-cell">Volume</div>
            <div className="table-cell">Referrals</div>
            <div className="table-cell">Commissions</div>
            <div className="table-cell">Growth</div>
            <div className="table-cell">Rank</div>
            <div className="table-cell">Change</div>
          </div>
          {restOfLeaderboard.map((member) => (
            <div
              key={member.id}
              className={`table-row ${member.isCurrentUser ? 'current-user' : ''}`}
            >
              <div className="table-cell rank-col">
                {getRankIcon(member.rank)}
              </div>
              <div className="table-cell name-col">
                <div className="member-info">
                  <img src={member.avatar} alt={member.name} className="member-avatar" />
                  <div>
                    <div className="member-name">
                      {member.name}
                      {member.isCurrentUser && <span className="you-badge">You</span>}
                    </div>
                    <div className="member-id">ID: {member.userId}</div>
                  </div>
                </div>
              </div>
              <div className="table-cell">${member.volume.toLocaleString()}</div>
              <div className="table-cell">{member.referrals}</div>
              <div className="table-cell">${member.commissions.toLocaleString()}</div>
              <div className="table-cell">
                <span className={parseFloat(member.growth) >= 0 ? 'positive' : 'negative'}>
                  {parseFloat(member.growth) >= 0 ? '+' : ''}{member.growth}%
                </span>
              </div>
              <div className="table-cell">
                <span className="rank-badge-small">{member.rankName}</span>
              </div>
              <div className="table-cell">
                {member.change !== 0 && (
                  <span className={`position-change ${member.change > 0 ? 'up' : 'down'}`}>
                    {member.change > 0 ? <FaArrowUp /> : <FaArrowDown />}
                    {Math.abs(member.change)}
                  </span>
                )}
                {member.change === 0 && <span className="position-change neutral">-</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competition Section */}
      <div className="competition-section">
        <h2><FaFire /> Active Competitions</h2>
        <div className="competitions-grid">
          <div className="competition-card">
            <div className="competition-header">
              <h3>Monthly Volume Challenge</h3>
              <span className="competition-status active">Active</span>
            </div>
            <div className="competition-prize">
              <FaTrophy />
              <span>Prize: $5,000</span>
            </div>
            <div className="competition-progress">
              <div className="progress-label">Time Remaining: 12 days</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div className="competition-participants">
              <FaUsers />
              <span>245 participants</span>
            </div>
          </div>

          <div className="competition-card">
            <div className="competition-header">
              <h3>Referral Race</h3>
              <span className="competition-status active">Active</span>
            </div>
            <div className="competition-prize">
              <FaTrophy />
              <span>Prize: $2,500</span>
            </div>
            <div className="competition-progress">
              <div className="progress-label">Time Remaining: 5 days</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div className="competition-participants">
              <FaUsers />
              <span>189 participants</span>
            </div>
          </div>

          <div className="competition-card">
            <div className="competition-header">
              <h3>Growth Champion</h3>
              <span className="competition-status upcoming">Upcoming</span>
            </div>
            <div className="competition-prize">
              <FaTrophy />
              <span>Prize: $3,000</span>
            </div>
            <div className="competition-progress">
              <div className="progress-label">Starts in: 3 days</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '0%' }}></div>
              </div>
            </div>
            <div className="competition-participants">
              <FaUsers />
              <span>0 participants</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedLeaderboard;
