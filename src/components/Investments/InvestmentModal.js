import React, { useState, useEffect } from 'react';
import './InvestmentModal.css';

const InvestmentModal = ({ plan, onClose, onInvest, mlmType, setMlmType }) => {
  const [amount, setAmount] = useState(plan.min);
  const [error, setError] = useState('');

  // Disable body and html scroll when modal is open
  useEffect(() => {
    // Save current scroll position
    const scrollY = window.scrollY;

    // Get original styles
    const originalBodyOverflow = window.getComputedStyle(document.body).overflow;
    const originalHtmlOverflow = window.getComputedStyle(document.documentElement).overflow;
    const originalBodyPosition = window.getComputedStyle(document.body).position;
    const originalBodyTop = window.getComputedStyle(document.body).top;
    const originalBodyWidth = window.getComputedStyle(document.body).width;

    // Disable scroll on body and html
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.left = '0';
    document.body.style.right = '0';

    return () => {
      // Restore original styles
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;
      document.body.style.left = '';
      document.body.style.right = '';

      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setAmount(value);
    setError('');

    if (value < plan.min) {
      setError(`Minimum investment is $${plan.min.toLocaleString()}`);
    } else if (value > plan.max) {
      setError(`Maximum investment is $${plan.max.toLocaleString()}`);
    }
  };

  const handleInvest = () => {
    if (amount >= plan.min && amount <= plan.max) {
      onInvest(plan, amount);
    } else {
      setError('Please enter a valid investment amount');
    }
  };

  const expectedReturn = (amount * plan.maxROI) / 100;
  const profit = expectedReturn - amount;

  return (
    <div className="investment-modal-overlay" onClick={onClose}>
      <div className="investment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <span className="modal-plan-icon">{plan.icon}</span>
            <div>
              <h2>{plan.name} Investment Plan</h2>
              <p>Invest and earn up to {plan.maxROI}% ROI</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="plan-summary">
            <div className="summary-item">
              <span className="summary-label">Investment Range:</span>
              <span className="summary-value">
                ${plan.min.toLocaleString()} - ${plan.max.toLocaleString()}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Maximum ROI:</span>
              <span className="summary-value roi">{plan.maxROI}%</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Duration:</span>
              <span className="summary-value">{plan.duration} days</span>
            </div>
          </div>

          <div className="investment-input-section">
            <label htmlFor="investment-amount" className="input-label">
              Investment Amount
            </label>
            <div className="amount-input-wrapper">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                id="investment-amount"
                className="amount-input"
                value={amount}
                onChange={handleAmountChange}
                min={plan.min}
                max={plan.max}
                step="10"
              />
            </div>
            {error && <div className="error-message">{error}</div>}

            <div className="quick-amounts">
              <button
                className="quick-amount-btn"
                onClick={() => setAmount(plan.min)}
              >
                Min: ${plan.min.toLocaleString()}
              </button>
              <button
                className="quick-amount-btn"
                onClick={() => setAmount((plan.min + plan.max) / 2)}
              >
                Mid: ${Math.round((plan.min + plan.max) / 2).toLocaleString()}
              </button>
              <button
                className="quick-amount-btn"
                onClick={() => setAmount(plan.max)}
              >
                Max: ${plan.max.toLocaleString()}
              </button>
            </div>
          </div>

          <div className="return-calculation">
            <h3>Expected Returns</h3>
            <div className="return-details">
              <div className="return-item">
                <span className="return-label">Investment Amount:</span>
                <span className="return-value">${amount.toLocaleString()}</span>
              </div>
              <div className="return-item">
                <span className="return-label">Expected Return ({plan.maxROI}%):</span>
                <span className="return-value">${expectedReturn.toLocaleString()}</span>
              </div>
              <div className="return-item highlight">
                <span className="return-label">Net Profit:</span>
                <span className="return-value profit">${profit.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>


          <div className="form-group">
            <label>Select Investment Type</label>

            <div className="mlm-type-options">
              {["Binary", "Unilevel", "Matrix"].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={mlmType === type ? "active" : ""}
                  onClick={() => setMlmType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <button
            className="btn-invest"
            onClick={handleInvest}
            disabled={!!error || amount < plan.min || amount > plan.max}
            style={{ background: plan.color }}
          >
            Invest ${amount.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;
