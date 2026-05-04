import React, { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useTheme } from '../../context/ThemeContext';
import { setMembers, setSelectedMember, setSearchTerm, setFilterLevel, expandAll, collapseAll } from '../../store/slices/downlineSlice';
import TreeView from './TreeView';
// import D3TreeView from './D3TreeView';
// import { EarningsLineChart, NetworkGrowthChart } from '../Charts/EarningsChart';
import { LEVEL_COLORS } from '../../utils/constants';
import { generateThemeGradients } from '../../utils/colorUtils';
import AuthService from '../../Apis/AuthService/AuthService';
import LoaderHelper from '../../utils/Loading/LoaderHelper';
import { alertErrorMessage } from '../../utils/CustomAlertMessage/index';
import './Downline.css';

const Downline = ({ user }) => {
  const dispatch = useAppDispatch();
  const { currentTheme } = useTheme();
  const { members, selectedMember, searchTerm, filterLevel } = useAppSelector((state) => state.downline);
  const [viewMode, setViewMode] = useState('tree'); // 'tree', 'd3', 'list'
  const [showCharts, setShowCharts] = useState(true);

  // Generate theme-based card colors - updates when theme changes
  const cardGradients = useMemo(() => {
    return generateThemeGradients(currentTheme);
  }, [currentTheme]);

  // Load API data on mount
  useEffect(() => {
    fetchDownlineData();
  }, [dispatch]);

  const fetchDownlineData = async () => {
    try {
      LoaderHelper.loaderStatus(true);
      
      const response = await AuthService.getDownlineUnilevel();

      if (response?.success) {
        // Assume backend returns a flat array of members (with id, parentId, etc.)
        const fetchedMembers = response?.data?.members || response?.data || [];
        dispatch(setMembers(fetchedMembers));
      } else {
        alertErrorMessage(response?.message || 'Failed to fetch downline members');
      }
    } catch (error) {
      console.error("Downline fetch error:", error);
      alertErrorMessage('Something went wrong while fetching downline data.');
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.id.toString().includes(searchTerm);
    const matchesLevel = filterLevel === 'all' || member.level.toString() === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const levelStats = {
    total: members.length,
    level1: members.filter(m => m.level === 1).length,
    level2: members.filter(m => m.level === 2).length,
    level3: members.filter(m => m.level === 3).length,
    level4: members.filter(m => m.level === 4).length,
  };

  const handleNodeSelect = (node) => {
    dispatch(setSelectedMember(node));
  };

  const handleExpandAll = () => {
    dispatch(expandAll());
  };

  const handleCollapseAll = () => {
    dispatch(collapseAll());
  };

  return (
    <div className="downline-container">
      <div className="page-header">
        <div>
          <h1>My Downline Network</h1>
          <p>View and manage your network structure with advanced tree visualization</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowCharts(!showCharts)}
          >
            {showCharts ? 'Hide' : 'Show'} Charts
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="downline-stats">
        <div className="stat-card" style={{ background: cardGradients.card1 }}>
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">{levelStats.total}</div>
            <div className="stat-label">Total Members</div>
          </div>
        </div>
        <div className="stat-card" style={{ background: cardGradients.card2 }}>
          <div className="stat-icon">1️⃣</div>
          <div className="stat-info">
            <div className="stat-value">{levelStats.level1}</div>
            <div className="stat-label">Level 1</div>
          </div>
        </div>

        <div className="stat-card" style={{ background: cardGradients.card3 }}>
          <div className="stat-icon">2️⃣</div>
          <div className="stat-info">
            <div className="stat-value">{levelStats.level2}</div>
            <div className="stat-label">Level 2</div>
          </div>
        </div>
        <div className="stat-card" style={{ background: cardGradients.card4 }}>
          <div className="stat-icon">3️⃣</div>
          <div className="stat-info">
            <div className="stat-value">{levelStats.level3}</div>
            <div className="stat-label">Level 3+</div>
          </div>
        </div>

      </div>




      {/* Charts Section */}
      {/* {showCharts && (
        <div className="charts-section">
          <div className="charts-grid">
            <EarningsLineChart />
            <NetworkGrowthChart />
          </div>
        </div>
      )} */}

      {/* View Mode Toggle */}
      <div className="view-mode-toggle">
        <button
          className={`view-btn ${viewMode === 'tree' ? 'active' : ''}`}
          onClick={() => setViewMode('tree')}
        >
          📋 Tree View
        </button>
        {/* <button
          className={`view-btn ${viewMode === 'd3' ? 'active' : ''}`}
          onClick={() => setViewMode('d3')}
        >
          🌳 D3 Visualization
        </button> */}
        <button
          className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
        >
          📊 List View
        </button>
      </div>

      {/* Filters and Controls */}
      <div className="downline-controls">
        <div className="downline-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="search-input"
            />
          </div>
          <div className="filter-box">
            <select
              value={filterLevel}
              onChange={(e) => dispatch(setFilterLevel(e.target.value))}
              className="filter-select"
            >
              <option value="all">All Levels</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3+</option>
            </select>
          </div>
        </div>
        {viewMode === 'tree' && (
          <div className="tree-controls">
            <button className="btn btn-outline" onClick={handleExpandAll}>
              Expand All
            </button>
            <button className="btn btn-outline" onClick={handleCollapseAll}>
              Collapse All
            </button>
          </div>
        )}
      </div>

      {/* Selected Member Info */}
      {selectedMember && (
        <div className="selected-member-card">
          <h3>Selected Member Details</h3>
          <div className="member-details-grid">
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{selectedMember.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">ID:</span>
              <span className="detail-value">{selectedMember.id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Level:</span>
              <span className="detail-value">Level {selectedMember.level}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Referrals:</span>
              <span className="detail-value">{selectedMember.referrals || 0}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Total Earnings:</span>
              <span className="detail-value">{selectedMember.totalEarnings || '$0'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Join Date:</span>
              <span className="detail-value">
                {selectedMember.joinDate ? new Date(selectedMember.joinDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{selectedMember.email || 'abc@gmail.com'}</span>
            </div>

          </div>
          <button
            className="btn btn-outline"
            onClick={() => dispatch(setSelectedMember(null))}
          >
            Close
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="downline-content">
        {viewMode === 'tree' && (
          <div className="tree-view-wrapper">
            <TreeView onNodeSelect={handleNodeSelect} />
          </div>
        )}

        {/* {viewMode === 'd3' && (
          <div className="d3-view-wrapper">
            <D3TreeView width={1200} height={600} />
          </div>
        )} */}

        {viewMode === 'list' && (
          <div className="downline-list-card">
            <h2>Downline Members</h2>
            <div className="downline-table">
              <div className="table-header">
                <div className="table-cell">Member</div>
                <div className="table-cell">Level</div>
                <div className="table-cell">Referrals</div>
                <div className="table-cell">Total Earnings</div>
                <div className="table-cell">Join Date</div>
              </div>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`table-row ${selectedMember?.id === member.id ? 'selected' : ''}`}
                    onClick={() => handleNodeSelect(member)}
                  >
                    <div className="table-cell" data-label="Member">
                      <div className="member-info">
                        <div
                          className="member-avatar"
                          style={{ backgroundColor: LEVEL_COLORS[member.level] || LEVEL_COLORS[5] }}
                        >
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="member-name">{member.name}</div>
                          <div className="member-id">ID: {member.id}</div>
                        </div>
                      </div>
                    </div>
                    <div className="table-cell" data-label="Level">
                      <span
                        className={`level-badge level-${member.level}`}
                        style={{ backgroundColor: LEVEL_COLORS[member.level] || LEVEL_COLORS[5] }}
                      >
                        Level {member.level}
                      </span>
                    </div>
                    <div className="table-cell" data-label="Referrals">{member.referrals}</div>
                    <div className="table-cell earnings" data-label="Total Earnings">{member.totalEarnings}</div>
                    <div className="table-cell" data-label="Join Date">
                      {new Date(member.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>No members found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Downline;
