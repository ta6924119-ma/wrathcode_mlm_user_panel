import React, { useState, useEffect } from 'react';
import BasePage from '../Pages/BasePage';
import { FaUserPlus, FaDownload, FaFilter, FaClock } from 'react-icons/fa';
import './JoiningReport.css';
import AuthService from '../../Apis/AuthService/AuthService';

const JoiningReport = ({ user }) => {
  const [dateRange, setDateRange] = useState('month');
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJoiningReport = async () => {
      setLoading(true);
      const response = await AuthService.getJoiningReport();
      if (response.success) {
        setTeamData(response.data?.teamData || response.data || []);
      } else {
        console.error("Failed to fetch joining report:", response.error);
      }
      setLoading(false);
    };
    fetchJoiningReport();
  }, []);

  const totalMembers = teamData.length;
  const activeMembers = teamData.filter(m => m.status === 'Active').length;
  const directReferrals = teamData.filter(m => m.level === 1).length;
  const multipleReferrals = teamData.filter(m => m.level === 3).length;

  return (
    <BasePage
      title="Team Report"
      subtitle="View team joining statistics"
      icon={<FaUserPlus />}
    >
      <div className="joining-report-content">
        <div className="report-header">
          <div className="filter-section">
            <FaFilter />
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <button className="export-btn">
            <FaDownload /> Export Excel
          </button>
        </div>

        <div className="team-stats">
          <div className="stat-card">
            <div className="stat-label">Total Team Members</div>
            <div className="stat-value">{totalMembers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Members</div>
            <div className="stat-value">{activeMembers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Direct Referrals</div>
            <div className="stat-value">{directReferrals}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Inactive Members</div>
            <div className="stat-value">{totalMembers - activeMembers}</div>
          </div>


        </div>

        <div className="team-table-container">
          <table className="team-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Join Date</th>
                <th>Level</th>
                <th>Sponsor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    <FaClock className="spin" /> Loading team data...
                  </td>
                </tr>
              ) : teamData.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    No team members found.
                  </td>
                </tr>
              ) : (
                teamData.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{new Date(member.joinDate).toLocaleDateString()}</td>
                    <td>
                      <span className="level-badge">Level {member.level}</span>
                    </td>
                    <td>{member.sponsor}</td>
                    <td>
                      <span className={`status-badge ${member.status?.toLowerCase() || ''}`}>
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </BasePage>
  );
};

export default JoiningReport;
