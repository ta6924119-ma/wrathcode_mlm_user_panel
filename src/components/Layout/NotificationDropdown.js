import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiX, FiCheck, FiCheckCircle, FiAlertCircle, FiInfo, FiDollarSign, FiUser, FiTrendingUp } from 'react-icons/fi';
import './NotificationDropdown.css';

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'commission',
      title: 'New Commission Earned',
      message: 'You earned $120 commission from referral John Smith',
      time: '2 hours ago',
      read: false,
      icon: FiDollarSign,
      link: '/commissions'
    },
    {
      id: 2,
      type: 'referral',
      title: 'New Referral Added',
      message: 'Jane Doe joined using your referral code',
      time: '5 hours ago',
      read: false,
      icon: FiUser,
      link: '/referrals'
    },
    {
      id: 3,
      type: 'investment',
      title: 'Investment Matured',
      message: 'Your investment of $500 has matured. Returns: $750',
      time: '1 day ago',
      read: false,
      icon: FiTrendingUp,
      link: '/investments'
    },
    {
      id: 4,
      type: 'withdrawal',
      title: 'Withdrawal Processed',
      message: 'Your withdrawal of $200 has been processed successfully',
      time: '2 days ago',
      read: true,
      icon: FiCheckCircle,
      link: '/wallet'
    },
    {
      id: 5,
      type: 'system',
      title: 'System Update',
      message: 'New features added to your dashboard. Check them out!',
      time: '3 days ago',
      read: true,
      icon: FiInfo,
      link: '/dashboard'
    },
    {
      id: 6,
      type: 'bonus',
      title: 'Bonus Earned',
      message: 'Congratulations! You earned a milestone bonus of $50',
      time: '4 days ago',
      read: true,
      icon: FiCheckCircle,
      link: '/commissions'
    }
  ]);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationIcon = (notification) => {
    const IconComponent = notification.icon;
    const iconConfig = {
      commission: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
      referral: { color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
      investment: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
      withdrawal: { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
      system: { color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)' },
      bonus: { color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' },
      success: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
      warning: { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' },
      info: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
      error: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
    };
    const config = iconConfig[notification.type] || iconConfig.info;
    
    return (
      <div className="notification-icon" style={{ background: config.bg, color: config.color }}>
        <IconComponent />
      </div>
    );
  };

  return (
    <div className="notification-dropdown-container" ref={dropdownRef}>
      <button 
        className="notification-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        <FiBell />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              {unreadCount > 0 && (
                <button 
                  className="mark-all-read-btn"
                  onClick={markAllAsRead}
                  title="Mark all as read"
                >
                  <FiCheck />
                  <span>Mark all read</span>
                </button>
              )}
              <button 
                className="close-dropdown-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                <FiX />
              </button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <FiBell />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.link) {
                      navigate(notification.link);
                      setIsOpen(false);
                    }
                  }}
                >
                  <div className="notification-content">
                    {getNotificationIcon(notification)}
                    <div className="notification-text">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">{notification.time}</div>
                    </div>
                  </div>
                  <button 
                    className="delete-notification-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    title="Delete"
                  >
                    <FiX />
                  </button>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notification-footer">
              <button 
                className="view-all-link"
                onClick={() => {
                  navigate('/notifications');
                  setIsOpen(false);
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
