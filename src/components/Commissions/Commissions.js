import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCommissions } from '../../store/slices/commissionSlice';
// import { EarningsLineChart } from '../Charts/EarningsChart';
import { COMMISSION_TYPES, STATUS_COLORS } from '../../utils/constants';
import AuthService from '../../Apis/AuthService/AuthService';
import './Commissions.css';


//c = api se aana wala commission object
const mapApiCommission = (c) => ({
  id: c._id,
  type: c.commissionType || 'direct',
  amount: c.amount || 0,
  date: c.createdAt || c.paidAt || new Date().toISOString(),
  status: (c.status || 'pending').toLowerCase(),
  member: c.fromUser ? [c.fromUser.firstName, c.fromUser.lastName].filter(Boolean).join(' ') || c.fromUser.username : '',
  description: c.description || '',
});

const Commissions = ({ user }) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const { commissions, totalEarnings, monthlyEarnings, pendingEarnings, paidEarnings } = useAppSelector((state) => state.commission);
  const [filterType, setFilterType] = useState('all');


  useEffect(() => {
    const fetchCommission = async () => {
      try {
        setLoading(true);

        const response = await AuthService.getCommission();

        const commissionsArray =
          response?.data?.data?.commissions ||
          response?.data?.data ||
          response?.data ||
          [];

        if (!Array.isArray(commissionsArray)) {
          return;
        }


        // assuming response.data me array aa raha hai
const mappedData = commissionsArray.map(mapApiCommission);        dispatch(setCommissions(mappedData));

      } catch (error) {
        console.error('Error fetching commissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommission();
  }, [dispatch]);

  const filteredCommissions = filterType === 'all'
    ? commissions
    : commissions.filter(c => c.status.toLowerCase() === filterType.toLowerCase());

  const getTypeIcon = (type) => {
    if (type === COMMISSION_TYPES.DIRECT) return '🎯';
    if (type === COMMISSION_TYPES.LEVEL_1) return '1️⃣';
    if (type === COMMISSION_TYPES.LEVEL_2) return '2️⃣';
    if (type === COMMISSION_TYPES.BONUS) return '🎁';
    return '💰';
  };

  const getTypeLabel = (type) => {
    const labels = {
      [COMMISSION_TYPES.DIRECT]: 'Direct Referral',
      [COMMISSION_TYPES.LEVEL_1]: 'Level 1 Commission',
      [COMMISSION_TYPES.LEVEL_2]: 'Level 2 Commission',
      [COMMISSION_TYPES.BONUS]: 'Bonus',
    };
    return labels[type] || type;
  };

  return (
    <div className="commissions-container">
      {/* Header Card */}      <div className="header-card">
        <div className="page-header">
          <div>
            <h1>Commissions & Earnings</h1>
            <p>Track your earnings and commission history with detailed analytics</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="commission-stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Total Commissions</div>
            <div className="stat-value">${totalEarnings.toFixed(2)}</div>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-label">Paid</div>
            <div className="stat-value">${paidEarnings.toFixed(2)}</div>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-label">Pending</div>
            <div className="stat-value">${pendingEarnings.toFixed(2)}</div>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-label">This Month</div>
            <div className="stat-value">${monthlyEarnings.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Chart - minimal: only earnings trend */}
      {/* <div className="chart-card">
        <div className="charts-section">
          <div className="chart-wrapper chart-single">
            <EarningsLineChart />
          </div>
        </div>
      </div> */}

      {/* Filters Card */}
      <div className="filters-card">
        <div className="commissions-filters">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All
            </button>
            <button
              className={`filter-tab ${filterType === 'paid' ? 'active' : ''}`}
              onClick={() => setFilterType('paid')}
            >
              Paid
            </button>
            <button
              className={`filter-tab ${filterType === 'pending' ? 'active' : ''}`}
              onClick={() => setFilterType('pending')}
            >
              Pending
            </button>
          </div>
        </div>
      </div>

      {/* Commissions List */}
      <div className="commissions-list-card">
        <h2>Commission History</h2>
        <div className="commissions-table">
          <div className="table-header">
            <div className="table-cell">Type</div>
            <div className="table-cell">Member</div>
            <div className="table-cell">Amount</div>
            <div className="table-cell">Date</div>
            <div className="table-cell">Status</div>
          </div>
          {filteredCommissions.length > 0 ? (
            filteredCommissions.map((commission) => (
              <div key={commission.id} className="table-row">
                <div className="table-cell" data-label="Type">
                  <div className="commission-type">
                    <span className="type-icon">{getTypeIcon(commission.type)}</span>
                    <span>{getTypeLabel(commission.type)}</span>
                  </div>
                </div>
                <div className="table-cell" data-label="Member">{commission.member}</div>
                <div className="table-cell amount" data-label="Amount">${commission.amount.toFixed(2)}</div>
                <div className="table-cell" data-label="Date">
                  {new Date(commission.date).toLocaleDateString()}
                </div>
                <div className="table-cell" data-label="Status">
                  <span
                    className={`status-badge ${commission.status.toLowerCase()}`}
                    style={{
                      backgroundColor: STATUS_COLORS[commission.status] || STATUS_COLORS.pending,
                      color: 'white'
                    }}
                  >
                    {commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No commissions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Commissions;