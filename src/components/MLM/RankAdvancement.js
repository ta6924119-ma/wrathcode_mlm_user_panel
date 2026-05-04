import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { RANKS } from '../../store/slices/mlmSystemSlice';
import { FaTrophy, FaMedal, FaCrown, FaStar, FaCheckCircle, FaLock, FaArrowUp, FaGift, FaFire, FaUsers, FaCoins, FaChartLine } from 'react-icons/fa';
import './RankAdvancement.css';

const RankAdvancement = ({ user }) => {
  const { userRank, teamStats, performance, commissions } = useAppSelector((state) => state.mlmSystem);
  const [achievements, setAchievements] = useState([]);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    // Calculate achievements
    const calculateAchievements = () => {
      const achievementsList = [];
      
      // Rank achievements
      Object.values(RANKS).forEach((rank, index) => {
        if (rank.id <= (userRank?.id || 0)) {
          achievementsList.push({
            id: `rank_${rank.id}`,
            type: 'rank',
            title: `${rank.name} Rank`,
            description: `Achieved ${rank.name} rank`,
            icon: <FaTrophy />,
            unlocked: true,
            date: new Date(Date.now() - ((userRank?.id || 0) - rank.id) * 30 * 24 * 60 * 60 * 1000).toISOString(),
            reward: `+${rank.bonus}% Bonus`,
          });
        } else {
          achievementsList.push({
            id: `rank_${rank.id}`,
            type: 'rank',
            title: `${rank.name} Rank`,
            description: `Reach ${rank.minTeam} team members and $${rank.minVolume.toLocaleString()} volume`,
            icon: <FaLock />,
            unlocked: false,
            progress: Math.min(
              (((teamStats?.totalTeamSize || 0) / (rank.minTeam || 1)) * 100),
              (((teamStats?.totalVolume || 0) / (rank.minVolume || 1)) * 100)
            ),
            requirements: {
              team: rank.minTeam,
              volume: rank.minVolume,
            },
          });
        }
      });

      // Milestone achievements
      const milestoneList = [
        {
          id: 'first_referral',
          title: 'First Referral',
          description: 'Get your first direct referral',
          icon: <FaStar />,
          unlocked: (teamStats?.directReferrals || 0) >= 1,
          progress: Math.min(((teamStats?.directReferrals || 0) / 1) * 100, 100),
        },
        {
          id: 'ten_team',
          title: '10 Team Members',
          description: 'Build a team of 10 members',
          icon: <FaUsers />,
          unlocked: (teamStats?.totalTeamSize || 0) >= 10,
          progress: Math.min(((teamStats?.totalTeamSize || 0) / 10) * 100, 100),
        },
        {
          id: 'fifty_team',
          title: '50 Team Members',
          description: 'Build a team of 50 members',
          icon: <FaUsers />,
          unlocked: (teamStats?.totalTeamSize || 0) >= 50,
          progress: Math.min(((teamStats?.totalTeamSize || 0) / 50) * 100, 100),
        },
        {
          id: 'hundred_team',
          title: '100 Team Members',
          description: 'Build a team of 100 members',
          icon: <FaUsers />,
          unlocked: (teamStats?.totalTeamSize || 0) >= 100,
          progress: Math.min(((teamStats?.totalTeamSize || 0) / 100) * 100, 100),
        },
        {
          id: 'first_commission',
          title: 'First Commission',
          description: 'Earn your first commission',
          icon: <FaCoins />,
          unlocked: (commissions?.total || 0) > 0,
          progress: (commissions?.total || 0) > 0 ? 100 : 0,
        },
        {
          id: 'thousand_volume',
          title: '$1,000 Volume',
          description: 'Generate $1,000 in team volume',
          icon: <FaChartLine />,
          unlocked: (teamStats?.totalVolume || 0) >= 1000,
          progress: Math.min(((teamStats?.totalVolume || 0) / 1000) * 100, 100),
        },
        {
          id: 'ten_thousand_volume',
          title: '$10,000 Volume',
          description: 'Generate $10,000 in team volume',
          icon: <FaChartLine />,
          unlocked: (teamStats?.totalVolume || 0) >= 10000,
          progress: Math.min(((teamStats?.totalVolume || 0) / 10000) * 100, 100),
        },
        {
          id: 'top_performer',
          title: 'Top Performer',
          description: 'Be in top 10% of performers',
          icon: <FaFire />,
          unlocked: (performance?.growthRate || 0) > 20,
          progress: Math.min(((performance?.growthRate || 0) / 20) * 100, 100),
        },
      ];

      setAchievements(achievementsList);
      setMilestones(milestoneList);
    };

    calculateAchievements();
  }, [userRank, teamStats, performance, commissions]);

  const nextRank = Object.values(RANKS).find(r => r.id === (userRank?.id || 0) + 1);
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="rank-advancement">
      <div className="rank-header">
        <div>
          <h1><FaTrophy /> Rank Advancement & Achievements</h1>
          <p>Track your progress and unlock achievements</p>
        </div>
        <div className="current-rank-badge">
          <FaCrown />
          <span>Current Rank: {userRank?.name || 'Starter'}</span>
        </div>
      </div>

      {/* Current Rank Display */}
      <div className="current-rank-section">
        <div className="rank-card-large">
          <div className="rank-icon-large">
            {(userRank?.id || 0) >= 4 ? <FaCrown /> : <FaTrophy />}
          </div>
          <div className="rank-info-large">
            <div className="rank-name-large">{userRank?.name || 'Starter'}</div>
            <div className="rank-bonus-large">+{userRank?.bonus || 0}% Bonus</div>
            <div className="rank-description">
              You've achieved {userRank?.name || 'Starter'} rank with {teamStats?.totalTeamSize || 0} team members
            </div>
          </div>
        </div>
      </div>

      {/* Next Rank Progress */}
      {nextRank && (
        <div className="next-rank-section">
          <h2>Next Rank: {nextRank?.name || 'N/A'}</h2>
          <div className="rank-progress-card">
            <div className="progress-stats">
              <div className="progress-stat">
                <div className="stat-label">Team Members</div>
                <div className="stat-value">
                  {teamStats?.totalTeamSize || 0} / {nextRank?.minTeam || 0}
                </div>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${Math.min(((teamStats?.totalTeamSize || 0) / (nextRank?.minTeam || 1)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="progress-stat">
                <div className="stat-label">Team Volume</div>
                <div className="stat-value">
                  ${(teamStats?.totalVolume || 0).toLocaleString()} / ${(nextRank?.minVolume || 0).toLocaleString()}
                </div>
                <div className="stat-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${Math.min(((teamStats?.totalVolume || 0) / (nextRank?.minVolume || 1)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="next-rank-reward">
              <FaGift />
              <span>Unlock Reward: +{nextRank?.bonus || 0}% Bonus</span>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Section */}
      <div className="achievements-section">
        <h2><FaMedal /> Rank Achievements</h2>
        <div className="achievements-grid">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">
                {achievement.unlocked ? achievement.icon : <FaLock />}
              </div>
              <div className="achievement-content">
                <div className="achievement-title">{achievement.title}</div>
                <div className="achievement-description">{achievement.description}</div>
                {achievement.unlocked && achievement.reward && (
                  <div className="achievement-reward">
                    <FaGift />
                    <span>{achievement.reward}</span>
                  </div>
                )}
                {!achievement.unlocked && achievement.progress !== undefined && (
                  <div className="achievement-progress">
                    <div className="progress-label">Progress: {achievement.progress.toFixed(1)}%</div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {!achievement.unlocked && achievement.requirements && (
                  <div className="achievement-requirements">
                    <div>Team: {achievement.requirements.team} members</div>
                    <div>Volume: ${achievement.requirements.volume.toLocaleString()}</div>
                  </div>
                )}
              </div>
              {achievement.unlocked && (
                <div className="unlocked-badge">
                  <FaCheckCircle />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Milestones Section */}
      <div className="milestones-section">
        <h2><FaStar /> Milestones</h2>
        <div className="milestones-grid">
          {milestones.map((milestone) => (
            <div 
              key={milestone.id} 
              className={`milestone-card ${milestone.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="milestone-icon">
                {milestone.unlocked ? milestone.icon : <FaLock />}
              </div>
              <div className="milestone-content">
                <div className="milestone-title">{milestone.title}</div>
                <div className="milestone-description">{milestone.description}</div>
                {!milestone.unlocked && (
                  <div className="milestone-progress">
                    <div className="progress-label">{milestone.progress.toFixed(1)}%</div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${milestone.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              {milestone.unlocked && (
                <div className="milestone-badge">
                  <FaCheckCircle />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="rank-statistics">
        <h2>Rank Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><FaTrophy /></div>
            <div className="stat-value">{userRank?.name || 'Starter'}</div>
            <div className="stat-label">Current Rank</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><FaMedal /></div>
            <div className="stat-value">{unlockedAchievements.length}</div>
            <div className="stat-label">Achievements Unlocked</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><FaUsers /></div>
            <div className="stat-value">{teamStats?.totalTeamSize || 0}</div>
            <div className="stat-label">Team Members</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><FaChartLine /></div>
            <div className="stat-value">${(teamStats?.totalVolume || 0).toLocaleString()}</div>
            <div className="stat-label">Total Volume</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankAdvancement;
