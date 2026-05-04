import React, { useState, useEffect } from 'react';
import BasePage from '../Pages/BasePage';
import { FaExchangeAlt, FaDownload, FaFilter, FaArrowRight, FaClock } from 'react-icons/fa';
import './FundTransfer.css';
import AuthService from '../../Apis/AuthService/AuthService';

const FundTransfer = ({ user }) => {
  const [dateRange, setDateRange] = useState('month');
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransfers = async () => {
      setLoading(true);
      const response = await AuthService.getFundTransfers();
      if (response.success) {
        setTransfers(response.data?.transfers || response.data || []);
      } else {
        console.error("Failed to fetch fund transfers:", response.error);
      }
      setLoading(false);
    };
    fetchTransfers();
  }, []);

  const totalTransfers = transfers.length;
  const totalAmount = transfers.reduce((sum, t) => sum + t.amount, 0);
  const completedTransfers = transfers.filter(t => t.status === 'Completed').length;

  return (
    <BasePage
      title="Wallet Report"
      subtitle="View wallet transfer history"
      icon={<FaExchangeAlt />}
    >
      <div className="fund-transfer-content">
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

        <div className="transfer-stats">
          <div className="stat-card">
            <div className="stat-label">Total Transfers</div>
            <div className="stat-value">{totalTransfers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Amount</div>
            <div className="stat-value">${totalAmount.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{completedTransfers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{totalTransfers - completedTransfers}</div>
          </div>
        </div>

        <div className="transfer-table-container">
          <table className="transfer-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>From</th>
                <th></th>
                <th>To</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    <FaClock className="spin" /> Loading transfers...
                  </td>
                </tr>
              ) : transfers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    No transfers found.
                  </td>
                </tr>
              ) : (
                transfers.map((transfer) => (
                  <tr key={transfer.id}>
                    <td>{new Date(transfer.date).toLocaleDateString()}</td>
                    <td className="wallet-name">{transfer.from}</td>
                    <td className="arrow-icon"><FaArrowRight /></td>
                    <td className="wallet-name">{transfer.to}</td>
                    <td className="amount">${(transfer.amount || 0).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${transfer.status?.toLowerCase() || ''}`}>
                        {transfer.status}
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

export default FundTransfer;
