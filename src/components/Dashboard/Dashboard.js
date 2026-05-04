import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers, FaUserCheck, FaDollarSign, FaWallet,
  FaChartLine, FaShareAlt, FaFileAlt, FaCreditCard,
  FaUserPlus, FaTrophy, FaBox, FaCoins
} from 'react-icons/fa';
import './Dashboard.css';
import AuthService from '../../Apis/AuthService/AuthService';
import LoaderHelper from "../../utils/Loading/LoaderHelper";
import { alertErrorMessage } from "../../utils/CustomAlertMessage/index";

const formatMoney = (n) =>
  `$${Number(n ?? 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { dateStyle: 'short' }) : '—';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    handleDashboard();
  }, []);

  const handleDashboard = async () => {
    try {
      LoaderHelper.loaderStatus(true);
      const result = await AuthService.getDashboardData();


      if (result?.success) {
        setDashboardData(result?.data ?? null);
      } else {
        alertErrorMessage(result?.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      alertErrorMessage('Something went wrong while fetching dashboard data.');
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const raw = dashboardData;

  const overview = raw?.dashboardStats ?? {};

  const downlineStats = raw?.downlineStats ?? {
    total: 0,
    active: 0,
    pending: 0
  };

  const recentCommissions = Array.isArray(raw?.recentCommissions) ? raw.recentCommissions : [];
  const recentOrders = Array.isArray(raw?.recentOrders) ? raw.recentOrders : [];
  const topPerformers = Array.isArray(raw?.topPerformers) ? raw.topPerformers : [];

  const statsConfig = [
    { key: 'totalReferrals', label: 'Total Referrals', Icon: FaUsers, color: '#6366f1' },
    { key: 'activeReferrals', label: 'Active Referrals', Icon: FaUserCheck, color: '#10b981' },
    { key: 'pendingReferrals', label: 'Pending Referrals', Icon: FaUserCheck, color: '#f97316' },
    { key: 'totalEarnings', label: 'Total Earnings', Icon: FaDollarSign, color: '#f59e0b', isMoney: true },
    { key: 'availableBalance', label: 'Available Balance', Icon: FaWallet, color: '#8b5cf6', isMoney: true },
    { key: 'monthlyEarning', label: 'Monthly Earnings', Icon: FaChartLine, color: '#06b6d4', isMoney: true },
  ];

  const stats = useMemo(() => {
    return statsConfig.map(item => ({
      ...item,
      value: item.isMoney
        ? formatMoney(overview[item.key])
        : String(overview[item.key] ?? 0)
    }));
  }, [overview]);

  const quickActions = [
    { label: 'Share Referral', path: '/referrals', Icon: FaShareAlt },
    { label: 'Commissions', path: '/commissions', Icon: FaFileAlt },
    { label: 'Wallet', path: '/enhanced-wallet', Icon: FaCreditCard },
    { label: 'Invite Friends', path: '/referrals', Icon: FaUserPlus },
    { label: 'MLM Dashboard', path: '/mlm-dashboard', Icon: FaChartLine },
  ];

  const displayName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    'User';

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div className="dashboard-header">
        <div className="dashboard-header-top">
          <h1>Welcome, {displayName}</h1>
          {overview.rank && (
            <span className="dashboard-rank-badge">{overview.rank}</span>
          )}
        </div>
        <p>
          Downline: {downlineStats.total} members · {downlineStats.active} active
        </p>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.Icon;
          return (
            <div key={index} className="stat-card">
              <div
                className="stat-icon"
                style={{
                  background: `${stat.color}18`,
                  color: stat.color
                }}
              >
                <Icon size={22} />
              </div>

              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CONTENT */}
      <div className="dashboard-content dashboard-content-three">

        {/* COMMISSIONS */}
        <div className="content-card">
          <h2>Recent Commissions</h2>
          <div className="activity-list">
            {recentCommissions.length === 0 ? (
              <p className="dashboard-empty">No recent commissions</p>
            ) : (
              recentCommissions.map((item, i) => (
                <div key={item.id ?? i} className="activity-item">
                  <div className="activity-icon"><FaCoins size={16} /></div>

                  <div className="activity-details">
                    <div className="activity-description">
                      {item.type ?? item.description ?? 'Commission'}
                    </div>
                    <div className="activity-date">
                      {formatDate(item.date ?? item.createdAt)}
                    </div>
                  </div>

                  <div className="activity-amount">
                    {formatMoney(item.amount ?? item.commission ?? 0)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ORDERS */}
        <div className="content-card">
          <h2>Recent Orders</h2>
          <div className="activity-list">
            {recentOrders.length === 0 ? (
              <p className="dashboard-empty">No recent orders</p>
            ) : (
              recentOrders.map((item, i) => (
                <div key={item.id ?? i} className="activity-item">
                  <div className="activity-icon"><FaBox size={16} /></div>

                  <div className="activity-details">
                    <div className="activity-description">
                      {item.plan ?? 'Order'}
                    </div>
                    <div className="activity-date">
                      {formatDate(item.date)}
                    </div>
                  </div>

                  <div className="activity-amount">
                    {formatMoney(item.amount ?? 0)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* TOP PERFORMERS */}
        <div className="content-card">
          <h2>Top Performers</h2>
          <div className="activity-list">
            {topPerformers.length === 0 ? (
              <p className="dashboard-empty">No top performers yet</p>
            ) : (
              topPerformers.map((item, i) => (
                <div key={item.id ?? item.userId ?? i} className="activity-item">
                  <div className="activity-icon"><FaTrophy size={16} /></div>

                  <div className="activity-details">
                    <div className="activity-description">
                      {item.name ?? item.username ?? 'Member'}
                    </div>
                    <div className="activity-date">
                      Rank: {item.rank ?? '—'}
                    </div>
                  </div>

                  <div className="activity-amount">
                    {formatMoney(item.earnings ?? item.totalEarnings ?? 0)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="dashboard-content">
        <div className="content-card content-card-full">
          <h2>Quick Actions</h2>

          <div className="quick-actions quick-actions-grid">
            {quickActions.map((action, i) => {
              const ActionIcon = action.Icon;
              return (
                <button
                  key={i}
                  className="action-button"
                  onClick={() => navigate(action.path)}
                >
                  <ActionIcon className="action-icon" size={18} />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;