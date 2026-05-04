import React from 'react';
import './InvestmentHistory.css';

const InvestmentHistory = ({ investments }) => {
  // Show all investments that are not currently active (i.e., completed, withdrawn, etc.)
  const completedInvestments = investments.filter(inv => inv.status !== 'active');

  if (completedInvestments.length === 0) {
    return null;
  }

  return (
    <div className="investment-history-section">
      <h2 className="section-title">Investment History</h2>
      <div className="history-table">
        <div className="table-header">
          <div className="table-cell">Plan</div>
          <div className="table-cell">Amount</div>
          <div className="table-cell">Returns</div>
          <div className="table-cell">ROI</div>
          <div className="table-cell">End Date</div>
          <div className="table-cell">Status</div>
        </div>
        {completedInvestments.map((investment) => {
          const roi = ((investment.returns / investment.amount) * 100).toFixed(1);
          return (
            <div key={investment.id} className="table-row">
              <div className="table-cell" data-label="Plan">
                <div className="plan-cell">
                  <span className="plan-icon-small">{investment.plan.icon}</span>
                  <span>{investment.plan.name}</span>
                </div>
              </div>
              <div className="table-cell" data-label="Amount">${investment.amount.toLocaleString()}</div>
              <div className="table-cell earnings" data-label="Returns">${investment.returns.toLocaleString()}</div>
              <div className="table-cell roi" data-label="ROI">{roi}%</div>
              <div className="table-cell" data-label="End Date">
                {new Date(investment.endDate).toLocaleDateString()}
              </div>
              <div className="table-cell" data-label="Status">
                <span className="status-badge completed">Completed</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InvestmentHistory;
