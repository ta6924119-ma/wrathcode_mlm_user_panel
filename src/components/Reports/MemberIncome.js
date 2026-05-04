
import React, { useState } from 'react';
import BasePage from '../Pages/BasePage';
import { useEffect } from 'react';
import { FaDollarSign, FaDownload, FaFilter ,FaClock} from 'react-icons/fa';
import './MemberIncome.css';
import AuthService from '../../Apis/AuthService/AuthService';


const MemberIncome = ({ user }) => {
  const [dateRange, setDateRange] = useState('month');
const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);




  useEffect(() => {
    const fetchMemberIncome = async () => {
      setLoading(true);
      const response = await AuthService.getMemberIncome();
      if (response.success) {
        setIncomeData(response.data?.incomeData || response.data || []);
      } else {
        console.error("Failed to fetch member income:", response.error);
      }
      setLoading(false);
    };
    fetchMemberIncome();
  }, []);


  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const paidIncome = incomeData.filter(i => i.status === 'Paid').reduce((sum, item) => sum + item.amount, 0);
  const pendingIncome = incomeData.filter(i => i.status === 'Pending').reduce((sum, item) => sum + item.amount, 0);


  return (
   <BasePage
      title="Member Income Report"
      subtitle="View member income statistics"
      icon={<FaDollarSign />}
    >
      <div className="member-income-content">
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

        <div className="income-stats">
          <div className="stat-card">
            <div className="stat-label">Total Income</div>
            <div className="stat-value">${totalIncome.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Paid Income</div>
            <div className="stat-value">${paidIncome.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Income</div>
            <div className="stat-value">${pendingIncome.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Transactions</div>
            <div className="stat-value">{incomeData.length}</div>
          </div>
        </div>

        <div className="income-table-container">
          <table className="income-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Member/Source</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                    <FaClock className="spin" /> Loading income data...
                  </td>
                </tr>
              ) : incomeData.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                    No income records found.
                  </td>
                </tr>
              ) : (
                incomeData.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.date).toLocaleDateString()}</td>

                    <td>{item.type}</td>
                    <td className="amount">${(item.amount || 0).toFixed(2)}</td>
                    <td>{item.member}</td>
                    <td>
                      <span className={`status-badge ${item.status?.toLowerCase() || ''}`}>
                        {item.status}
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

export default MemberIncome;
