import React, { useState, useEffect } from 'react';
import BasePage from '../Pages/BasePage';
import { FaList, FaSearch, FaUsers, FaChartLine, FaQq } from 'react-icons/fa';
import './GenealogyList.css';
import AuthService from '../../Apis/AuthService/AuthService';

const GenealogyList = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState("all");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🚀 Fetching members...");

        const response = await AuthService.getList();

        console.log("📦 Raw API Response:", response);

        // ❌ If no response at all
        if (!response) {
          console.error("❌ No response received");
          setError("Failed to load members");
          return;
        }

        // ❌ If API explicitly fails
        if (response.success === false) {
          console.error("❌ API Error:", response.message);
          setError(response.message || "Failed to load members");
          return;
        }

        // ✅ Extract members correctly
        const dataList =
          response.members ||           // ✅ main key
          response.referralList ||      // fallback (old API)
          (Array.isArray(response) ? response : []);

        console.log("✅ Final Members Used:", dataList);
        console.log("📊 Members Count:", dataList.length);

        // ✅ Set members
        setMembers(dataList);

        // ⚠️ Not an error — just empty state
        if (dataList.length === 0) {
          console.warn("⚠️ No members found (empty array)");
        }

      } catch (err) {
        console.error("❌ Error fetching members:", err);
        setError("Something went wrong while fetching data");
      } finally {
        setLoading(false);
        console.log("🏁 Fetch complete");
      }
    };

    fetchMembers();
  }, []);
  const filteredMembers = members.filter(member => {
    // string me word h yaa nhi check kr rha h
    const nameStr = member.name || '';
    const emailStr = member.email || '';
    const levelStr = member.level ? member.level.toString() : '';

    const matchesSearch = nameStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emailStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || levelStr === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const totalMembers = members.length;
  const activeMembers = members.filter(m => (m.status || '').toLowerCase() === 'active').length;
  const totalVolume = members.reduce((sum, m) => sum + (Number(m.volume) || 0), 0);

  return (
    <BasePage
      title="List View"
      subtitle="List view of all network members"
      icon={<FaList />}
    >
      <div className="genealogy-list-content">

        {loading && <p>Loading members...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <>
            <div className="list-stats">
              <div className="stat-card">
                <div className="stat-label">Total Members</div>
                <div className="stat-value">{totalMembers}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Active Members</div>
                <div className="stat-value">{activeMembers}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Volume</div>
                <div className="stat-value">${totalVolume.toLocaleString()}</div>
              </div>
            </div>

            <div className="list-filters">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
                <option value="all">All Levels</option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4+</option>
              </select>
            </div>

            <div className="members-table-container">
              <table className="members-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Level</th>
                    <th>Volume</th>
                    <th>Referrals</th>
                    <th>Join Date</th>
                    <th>Sponsor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member, index) => (
                    <tr key={member.id || index}>
                      <td data-label="Name">
                        <div className="member-info">
                          <div className="member-avatar">{(member.name || 'U').charAt(0).toUpperCase()}</div>
                          <span>{member.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td data-label="Email">{member.email || 'N/A'}</td>
                      <td data-label="Level">
                        <span className="level-badge">Level {member.level || 1}</span>
                      </td>
                      <td data-label="Volume" className="volume">${(Number(member.volume) || 0).toLocaleString()}</td>
                      <td data-label="Referrals">{member.referrals || 0}</td>
                      <td data-label="Join Date">{member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}</td>
                      <td data-label="Sponsor">{member.sponsor || 'N/A'}</td>
                      <td data-label="Status">
                        <span className={`status-badge ${(member.status || '').toLowerCase()}`}>
                          {member.status || 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredMembers.length === 0 && (
                <div className="no-results">
                  <FaUsers />
                  <p>No members found</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </BasePage>
  );
};

export default GenealogyList;
