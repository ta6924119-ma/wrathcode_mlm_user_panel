import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaChartLine,
  FaUsers,
  FaSitemap,
  FaDollarSign,
  FaComments,
  FaTools,
  FaUserCog,
  FaChevronDown,
  FaChevronRight,
  FaChevronLeft,
  FaCloud,
  FaUserCircle,
  FaChartBar,
  FaTrophy,
  FaWallet,
  FaMoneyBillWave,
  FaLifeRing,
  FaBox,
  FaBullhorn,
  FaIdCard
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });
  const [expandedItems, setExpandedItems] = useState({});

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar_collapsed', newState.toString());
    // Update body class for layout adjustment
    if (newState) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  };

  // Initialize body class on mount
  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    }
    return () => {
      document.body.classList.remove('sidebar-collapsed');
    };
  }, [isCollapsed]);

  const toggleExpand = (itemKey) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isParentActive = (paths) => {
    return paths.some(path => location.pathname === path);
  };

  // Complete Navigation structure matching Dashboard Sidebar
  const navigationItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <FaChartLine />,
      path: '/dashboard',
      hasSubmenu: false,
      category: null
    },
    {
      key: 'genealogy',
      label: 'Genealogy / Referral Tree',
      icon: <FaSitemap />,
      path: '/genealogy',
      hasSubmenu: true,
      subItems: [
        { label: 'Binary Tree', path: '/genealogy/binary' },
        { label: 'Unilevel Tree', path: '/genealogy/tree' },
        { label: 'Matrix Tree', path: '/genealogy/sponsor' },
        { label: 'List View', path: '/genealogy/list' }
      ],
      category: null
    },
    {
      key: 'my-team',
      label: 'My Team / Network',
      icon: <FaUsers />,
      path: '/downline',
      hasSubmenu: false,
      category: null
    },
    {
      key: 'income-earnings',
      label: 'Income & Commissions',
      icon: <FaDollarSign />,
      path: '/commissions',
      hasSubmenu: false,
      category: null
    },
    {
      key: 'wallet',
      label: 'Wallet Management',
      icon: <FaWallet />,
      path: '/enhanced-wallet',
      hasSubmenu: false,
      category: null
    },
    {
      key: 'withdraw',
      label: 'Withdraw / Payout',
      icon: <FaMoneyBillWave />,
      path: '/financial/payout',
      hasSubmenu: false,
      category: null
    },


    {
      key: 'deposit',
      label: 'Deposit / Investment',
      icon: <FaWallet />,
      path: '/financial/depositWallet',
      hasSubmenu: false,
      category: null
    },
    {
      key: 'packages',
      label: 'Packages / Investment',
      icon: <FaBox />,
      path: '/investments',
      hasSubmenu: false,
      category: null
    },
    {
      key: 'reports',
      label: 'Reports',
      icon: <FaChartBar />,
      path: '/reports',
      hasSubmenu: true,
      subItems: [
        { label: 'Income Report', path: '/reports/member-income' },
        { label: 'Join Report', path: '/reports/joining-report' },
        { label: 'Fund Transfer', path: '/reports/fund-transfer' },
        // { label: 'ROI Report', path: '/reports/roi-report' },
        { label: 'Withdrawal Report', path: '/reports/payout' },
        { label: 'Tax Report', path: '/reports/TaxReport' }
      ],
      category: null
    },
    {
      key: 'rewards-ranks',
      label: 'Rewards & Ranks',
      icon: <FaTrophy />,
      path: '/rewards-bonuses',
      hasSubmenu: false,
      category: null
    },
    {
      key: 'support',
      label: 'Support',
      icon: <FaLifeRing />,
      path: '/support',
      hasSubmenu: false,
      category: null
    },
    {
      key: 'announcements',
      label: 'Announcements',
      icon: <FaBullhorn />,
      path: '/announcements',
      hasSubmenu: false,
      category: null
    },
    {
      key: 'kyc',
      label: 'KYC Verification',
      icon: <FaIdCard />,
      path: '/kyc',
      hasSubmenu: false,
      category: null
    },
    {
      key: 'profile',
      label: 'Profile Management',
      icon: <FaUserCircle />,
      path: '/profile',
      hasSubmenu: false,
      category: null
    }
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <FaCloud />
          </div>
          {!isCollapsed && <span className="logo-text">Wrathcode MLM</span>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={toggleCollapse}
          aria-label="Toggle sidebar"
        >
          <FaChevronLeft />
        </button>
      </div>

      {/* User Profile Section */}
      {!isCollapsed && (
        <div className="sidebar-user">
          <div className="user-avatar">
            <div className="emergency-icon">EMERGENCY</div>
          </div>
          <div className="user-info">
            <span className="user-name">{user?.username || user?.name || 'mlmadmin'}</span>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {navigationItems.map((item) => {
          const isActiveItem = isActive(item.path) || isParentActive(
            item.subItems?.map(sub => sub.path) || []
          );
          const isExpanded = expandedItems[item.key];

          return (
            <div key={item.key} className="nav-item-wrapper">
              <Link
                to={item.path}
                className={`nav-item ${isActiveItem ? 'active' : ''}`}
                onClick={(e) => {
                  if (item.hasSubmenu) {
                    e.preventDefault();
                    toggleExpand(item.key);
                  }
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                {!isCollapsed && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    {item.hasSubmenu && (
                      <span className="nav-arrow">
                        {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                      </span>
                    )}
                  </>
                )}
              </Link>

              {/* Submenu */}
              {item.hasSubmenu && !isCollapsed && isExpanded && (
                <div className="nav-submenu">
                  {item.subItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.path}
                      className={`nav-subitem ${isActive(subItem.path) ? 'active' : ''}`}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout Button */}
      {!isCollapsed && (
        <div className="sidebar-footer">
          <button onClick={onLogout} className="sidebar-logout">
            <FaUserCog />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
