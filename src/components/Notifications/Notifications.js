import React, { useState } from 'react';
import { FaBell, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationCircle } from 'react-icons/fa';
import './Notifications.css';

const Notifications = ({ user }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'commission',
      title: 'New Commission Earned',
      message: 'You earned $120 commission from referral John Smith',
      date: '2 hours ago',
      read: false,
      icon: '💰',
      color: '#10b981'
    },
    {
      id: 2,
      type: 'referral',
      title: 'New Referral Added',
      message: 'Jane Doe joined using your referral code',
      date: '5 hours ago',
      read: false,
      icon: '👥',
      color: '#6366f1'
    },
    {
      id: 3,
      type: 'investment',
      title: 'Investment Matured',
      message: 'Your investment of $500 has matured. Returns: $750',
      date: '1 day ago',
      read: false,
      icon: '💎',
      color: '#f59e0b'
    },
    {
      id: 4,
      type: 'withdrawal',
      title: 'Withdrawal Processed',
      message: 'Your withdrawal of $200 has been processed successfully',
      date: '2 days ago',
      read: true,
      icon: '💳',
      color: '#8b5cf6'
    },
    {
      id: 5,
      type: 'system',
      title: 'System Update',
      message: 'New features added to your dashboard. Check them out!',
      date: '3 days ago',
      read: true,
      icon: '🔔',
      color: '#64748b'
    },
    {
      id: 6,
      type: 'bonus',
      title: 'Bonus Earned',
      message: 'Congratulations! You earned a milestone bonus of $50',
      date: '4 days ago',
      read: true,
      icon: '🎉',
      color: '#ec4899'
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div className="header-content">
          <div className="header-title">
            <FaBell className="header-icon" />
            <h1>Notifications</h1>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>
          <p>Stay updated with your account activities</p>
        </div>
        {unreadCount > 0 && (
          <button className="mark-all-read-btn" onClick={markAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="notifications-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button 
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          Read ({notifications.length - unreadCount})
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="empty-notifications">
            <FaBell className="empty-icon" />
            <p>No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
            >
              <div className="notification-icon" style={{ background: `${notification.color}20`, color: notification.color }}>
                <span>{notification.icon}</span>
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <h3>{notification.title}</h3>
                  <span className="notification-date">{notification.date}</span>
                </div>
                <p className="notification-message">{notification.message}</p>
              </div>
              <div className="notification-actions">
                {!notification.read && (
                  <button 
                    className="action-btn read-btn"
                    onClick={() => markAsRead(notification.id)}
                    title="Mark as read"
                  >
                    <FaCheckCircle />
                  </button>
                )}
                <button 
                  className="action-btn delete-btn"
                  onClick={() => deleteNotification(notification.id)}
                  title="Delete"
                >
                  <FaTimesCircle />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
