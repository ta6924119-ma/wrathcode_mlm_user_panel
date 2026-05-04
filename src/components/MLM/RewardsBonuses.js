import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addBonus, addReward } from '../../store/slices/mlmSystemSlice';
import { FaGift, FaTrophy, FaCoins, FaStar, FaAward, FaUsers } from 'react-icons/fa';
import './RewardsBonuses.css';

const RewardsBonuses = ({ user }) => {
  const dispatch = useAppDispatch();
  const { bonuses, rewards } = useAppSelector((state) => state.mlmSystem);

  useEffect(() => {
    // Load mock bonuses and rewards
    const mockBonuses = [
      {
        id: '1',
        type: 'Performance Bonus',
        amount: 500,
        description: 'Monthly performance bonus for exceeding targets',
        date: new Date().toISOString(),
        status: 'earned',
      },
      {
        id: '2',
        type: 'Team Building Bonus',
        amount: 300,
        description: 'Bonus for building a team of 20+ members',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'earned',
      },
      {
        id: '3',
        type: 'Volume Bonus',
        amount: 750,
        description: 'Quarterly volume bonus',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
      },
    ];

    const mockRewards = [
      {
        id: '1',
        type: 'Rank Achievement',
        title: 'Gold Rank Achieved',
        description: 'Congratulations! You have achieved Gold rank',
        icon: <FaTrophy />,
        date: new Date().toISOString(),
        status: 'unlocked',
      },
      {
        id: '2',
        type: 'Milestone',
        title: '100 Team Members',
        description: 'You have successfully built a team of 100 members',
        icon: <FaUsers />,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'unlocked',
      },
      {
        id: '3',
        type: 'Performance',
        title: 'Top Performer',
        description: 'You are in the top 10% of performers this month',
        icon: <FaStar />,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'unlocked',
      },
    ];

    mockBonuses.forEach(bonus => dispatch(addBonus(bonus)));
    mockRewards.forEach(reward => dispatch(addReward(reward)));
  }, [dispatch]);

  const availableRewards = [
    {
      id: '1',
      title: 'Bronze Rank',
      description: 'Reach 5 team members and $1,000 volume',
      icon: <FaAward />,
      progress: 80,
      unlocked: false,
    },
    {
      id: '2',
      title: 'Silver Rank',
      description: 'Reach 15 team members and $5,000 volume',
      icon: <FaAward />,
      progress: 45,
      unlocked: false,
    },
    {
      id: '3',
      title: 'Gold Rank',
      description: 'Reach 50 team members and $20,000 volume',
      icon: <FaAward />,
      progress: 30,
      unlocked: false,
    },
    {
      id: '4',
      title: 'Platinum Rank',
      description: 'Reach 150 team members and $50,000 volume',
      icon: <FaAward />,
      progress: 10,
      unlocked: false,
    },
    {
      id: '5',
      title: 'Master Rank',
      description: 'Reach 350 team members and $70,000 volume',
      icon: <FaAward />,
      progress: 15,
      unlocked: false,
    },
  ];

  const totalBonuses = bonuses.reduce((sum, b) => sum + (b.status === 'earned' ? b.amount : 0), 0);
  const pendingBonuses = bonuses.reduce((sum, b) => sum + (b.status === 'pending' ? b.amount : 0), 0);

  return (
    <div className="rewards-bonuses">
      <div className="rewards-header">
        <div>
          <h1>Rewards & Bonuses</h1>
          <p>Track your bonuses, rewards, and achievements</p>
        </div>
        <div className="bonus-summary">
          <div className="bonus-summary-item">
            <div className="bonus-label">Total Earned</div>
            <div className="bonus-value earned">${totalBonuses.toFixed(2)}</div>
          </div>
          <div className="bonus-summary-item">
            <div className="bonus-label">Pending</div>
            <div className="bonus-value pending">${pendingBonuses.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Bonuses Section */}
      <div className="bonuses-section">
        <h2><FaCoins /> Bonuses</h2>
        <div className="bonuses-grid">
          {bonuses.map((bonus) => (
            <div key={bonus.id} className={`bonus-card ${bonus.status}`}>
              <div className="bonus-header">
                <div className="bonus-type">{bonus.type}</div>
                <div className={`bonus-status ${bonus.status}`}>
                  {bonus.status === 'earned' ? '✓ Earned' : '⏳ Pending'}
                </div>
              </div>
              <div className="bonus-amount">${bonus.amount.toFixed(2)}</div>
              <div className="bonus-description">{bonus.description}</div>
              <div className="bonus-date">
                {new Date(bonus.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Section */}
      <div className="rewards-section">
        <h2><FaGift /> Rewards & Achievements</h2>
        <div className="rewards-grid">
          {rewards.map((reward) => (
            <div key={reward.id} className={`reward-card ${reward.status}`}>
              <div className="reward-icon" style={{ color: reward.status === 'unlocked' ? '#fbbf24' : '#6366f1' }}>
                {reward.icon}
              </div>
              <div className="reward-content">
                <div className="reward-title">{reward.title}</div>
                <div className="reward-description">{reward.description}</div>
                <div className="reward-date">
                  {new Date(reward.date).toLocaleDateString()}
                </div>
              </div>
              {reward.status === 'unlocked' && (
                <div className="reward-badge">Unlocked</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Available Rewards */}
      <div className="available-rewards-section">
        <h2><FaTrophy /> Available Rewards</h2>
        <div className="available-rewards-grid">
          {availableRewards.map((reward) => (
            <div key={reward.id} className="available-reward-card">
              <div className="available-reward-icon">{reward.icon}</div>
              <div className="available-reward-content">
                <div className="available-reward-title">{reward.title}</div>
                <div className="available-reward-description">{reward.description}</div>
                <div className="available-reward-progress">
                  <div className="progress-label">Progress: {reward.progress}%</div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${reward.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              {reward.unlocked ? (
                <div className="unlocked-badge">✓ Unlocked</div>
              ) : (
                <div className="locked-badge">🔒 Locked</div>
              )}

              {/* {reward.unlocked ? "Unloacked" : "Locked"} */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardsBonuses;
