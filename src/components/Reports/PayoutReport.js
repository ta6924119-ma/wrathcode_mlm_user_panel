import React, { useState, useEffect } from 'react';
import BasePage from '../Pages/BasePage';
import { FaMoneyBillWave, FaDownload, FaFilter, FaClock } from 'react-icons/fa';
import './PayoutReport.css';
import AuthService from '../../Apis/AuthService/AuthService';

const PayoutReport = ({ user }) => {
  const [dateRange, setDateRange] = useState('month');

  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPayouts = async () => {
      setLoading(true);
      const response = await AuthService.getWithdrawalReport();
      if (response.success) {
        setPayouts(response.data?.payouts || response.data || []);
      } else {
        console.error("Failed to fetch withdrawal:", response.error);
      }
      setLoading(false);
    };
    fetchPayouts();
  }, []);

  const totalPayouts = payouts.length;
  const totalAmount = payouts.reduce((sum, p) => sum + p.amount, 0);
  const totalCharges = payouts.reduce((sum, p) => sum + p.charges, 0);
  const netAmount = payouts.reduce((sum, p) => sum + p.netAmount, 0);
  const completedPayouts = payouts.filter(p => p.status === 'Completed').length;


  // Additionally

  const pendingPayouts = payouts.filter(p => p.status === "Pending").length;

  const RejectedPayout = payouts.filter(p => p.status === "Rejected").length;

  return (
    <BasePage
      title="Withdrawal Report"
      subtitle="View payout history and statistics"
      icon={<FaMoneyBillWave />}
    >
      <div className="payout-report-content">
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

        <div className="payout-stats">
          <div className="stat-card">
            <div className="stat-label">Total Withdrawals</div>
            <div className="stat-value">{totalPayouts}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Amount</div>
            <div className="stat-value">${totalAmount.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Charges</div>
            <div className="stat-value">${totalCharges.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Net Amount</div>
            <div className="stat-value">${netAmount.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{completedPayouts}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value">{pendingPayouts}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Rejected</div>
            <div className="stat-value">{RejectedPayout}</div>
          </div>
        </div>

        <div className="payout-table-container">
          <table className="payout-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Charges</th>
                <th>Net Amount</th>
                <th>Transaction ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                    <FaClock className="spin" /> Loading payouts...
                  </td>
                </tr>
              ) : payouts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                    No payouts found.
                  </td>
                </tr>
              ) : (
                payouts.map((payout) => (
                  <tr key={payout.id}>
                    <td>{new Date(payout.date).toLocaleDateString()}</td>
                    <td className="amount">${(payout.amount || 0).toFixed(2)}</td>
                    <td>{payout.method}</td>
                    <td>${(payout.charges || 0).toFixed(2)}</td>
                    <td className="net-amount">${(payout.netAmount || 0).toFixed(2)}</td>
                    <td className="txn-id">{payout.transactionId}</td>
                    <td>
                      <span className={`status-badge ${payout.status?.toLowerCase() || ''}`}>
                        {payout.status}
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

export default PayoutReport;
