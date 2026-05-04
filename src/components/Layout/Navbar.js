import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import ThemeSwitcher from './ThemeSwitcher';
import NotificationDropdown from './NotificationDropdown';
import LanguageSwitcher from './LanguageSwitcher';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMobileMenuOpen]);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/mlm-dashboard', label: 'MLM System', icon: '🚀' },
    { path: '/referrals', label: 'Referrals', icon: '👥' },
    { path: '/downline', label: 'Downline', icon: '🌳' },
    { path: '/team-performance', label: 'Team Performance', icon: '📈' },
    { path: '/investments', label: 'Investments', icon: '💎' },
    { path: '/commissions', label: 'Commissions', icon: '💰' },
    { path: '/wallet', label: 'Wallet', icon: '💳' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/dashboard">
            <span className="brand-icon">🚀</span>
            <span className="brand-text">Wrathcode MLM</span>
          </Link>
        </div>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`navbar-link ${isActive(item.path)}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          {/* <ThemeSwitcher /> */}
          <LanguageSwitcher />
          <NotificationDropdown />
          <div className="navbar-user">
            <div className="user-info">
              <button onClick={onLogout} className="logout-button">
                Logout
              </button>
            </div>
          </div>
        </div>

        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
