import React from 'react';
import './InvestmentPlanCard.css';

const InvestmentPlanCard = ({ plan, onSelect }) => {
  return (
    <div
      className="investment-plan-card"
      style={{ borderTopColor: plan.color }}
      onClick={onSelect}
    >
      <div className="plan-header">
        <div className="plan-icon-large">{plan.icon}</div>
        <h3 className="plan-name">{plan.name}</h3>
      </div>

      <div className="plan-details">
        <div className="plan-detail-row">
          <span className="detail-label">Minimum:</span>
          <span className="detail-value">${plan.min.toLocaleString()}</span>
        </div>
        <div className="plan-detail-row">
          <span className="detail-label">Maximum:</span>
          <span className="detail-value">${plan.max.toLocaleString()}</span>
        </div>
        <div className="plan-detail-row">
          <span className="detail-label">Max ROI:</span>
          <span className="detail-value roi">{plan.maxROI}%</span>
        </div>
        <div className="plan-detail-row">
          <span className="detail-label">Duration:</span>
          <span className="detail-value">{plan.duration} days</span>
        </div>
      </div>

      <div className="plan-footer">
        <button
          className="invest-btn"
          style={{ background: plan.color }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          Invest Now
        </button>
      </div>
    </div>
  );
};

export default InvestmentPlanCard;
