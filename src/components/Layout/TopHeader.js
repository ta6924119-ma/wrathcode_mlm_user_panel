import React, { useState } from 'react';
import { FaBell, FaCog } from 'react-icons/fa';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationDropdown from './NotificationDropdown';
import './TopHeader.css';

const TopHeader = ({ user }) => {
  const [currency, setCurrency] = useState('USD');

  return (
    <div className="top-header">
      <div className="header-left">
        {/* Empty space for alignment */}
      </div>
      
      <div className="header-right">
        {/* Currency Selector */}
        {/* <div className="currency-selector">
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className="currency-select"
          >
            <option value="USD">USD $</option>
            <option value="EUR">EUR €</option>
            <option value="GBP">GBP £</option>
            <option value="INR">INR ₹</option>
          </select>
        </div> */}

        {/* Notifications */}
        {/* <NotificationDropdown /> */}

        {/* Settings */}
        <button className="header-icon-btn" aria-label="Settings">
          <FaCog />
        </button>

        {/* Language Switcher - Compact */}
        {/* <div className="language-switcher-compact">
          <LanguageSwitcher />
        </div> */}

        {/* User Avatar */}
        {/* <div className="user-avatar-small">
          <div className="emergency-badge">EM</div>
        </div> */}
      </div>
    </div>
  );
};

export default TopHeader;
