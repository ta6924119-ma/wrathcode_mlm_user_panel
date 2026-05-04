import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaBell, FaTimes, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import './Announcements.css';

const Announcements = ({ user }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPopup, setShowPopup] = useState(null);

  useEffect(() => {
    // Mock announcements data
    const mockAnnouncements = [
      {
        id: '1',
        type: 'important',
        title: 'System Maintenance Scheduled',
        message: 'System will be under maintenance on January 30, 2026 from 2:00 AM to 4:00 AM IST.',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        priority: 'high',
      },
      {
        id: '2',
        type: 'info',
        title: 'New Package Available',
        message: 'Check out our new Diamond Package with enhanced ROI benefits!',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        priority: 'medium',
      },
      {
        id: '3',
        type: 'success',
        title: 'Withdrawal Process Updated',
        message: 'Withdrawal requests will now be processed within 24 hours.',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        priority: 'low',
      },
      {
        id: '4',
        type: 'warning',
        title: 'KYC Verification Required',
        message: 'Please complete your KYC verification to enable withdrawals.',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        priority: 'high',
      },
    ];

    // Mock notifications data
    const mockNotifications = [
      {
        id: '1',
        type: 'commission',
        title: 'Commission Credited',
        message: 'Your commission of $150 has been credited to your Income Wallet.',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: '2',
        type: 'withdrawal',
        title: 'Withdrawal Approved',
        message: 'Your withdrawal request of $500 has been approved and processed.',
        date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: '3',
        type: 'team',
        title: 'New Team Member',
        message: 'John Doe has joined your team as a direct referral.',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
      },
      {
        id: '4',
        type: 'package',
        title: 'Package Upgrade Available',
        message: 'You are eligible to upgrade to Gold Package.',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        read: false,
      },
    ];

    setAnnouncements(mockAnnouncements);
    setNotifications(mockNotifications);
    setUnreadCount(
      mockAnnouncements.filter(a => !a.read).length +
      mockNotifications.filter(n => !n.read).length
    );

    // Show popup for high priority unread announcements
    const highPriorityUnread = mockAnnouncements.find(
      a => !a.read && a.priority === 'high'
    );
    if (highPriorityUnread) {
      setShowPopup(highPriorityUnread);
    }
  }, []);

  const markAsRead = (id, type) => {
    if (type === 'announcement') {
      setAnnouncements(announcements.map(a =>
        a.id === id ? { ...a, read: true } : a
      ));
    } else {
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ));
    }
    setUnreadCount(Math.max(0, unreadCount - 1));
  };

  const markAllAsRead = (type) => {
    if (type === 'announcement') {
      const unread = announcements.filter(a => !a.read).length;
      setAnnouncements(announcements.map(a => ({ ...a, read: true })));
      setUnreadCount(Math.max(0, unreadCount - unread));
    } else {
      const unread = notifications.filter(n => !n.read).length;
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(Math.max(0, unreadCount - unread));
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'important':
      case 'warning':
        return <FaExclamationCircle className="type-icon warning" />;
      case 'success':
        return <FaCheckCircle className="type-icon success" />;
      case 'info':
      default:
        return <FaInfoCircle className="type-icon info" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'important':
      case 'warning':
        return 'var(--warning-color, #f59e0b)';
      case 'success':
        return 'var(--success-color, #10b981)';
      case 'info':
      default:
        return 'var(--primary-color, #6366f1)';
    }
  };

  const filteredAnnouncements = announcements.sort((a, b) => {
    // Unread first, then by date
    if (a.read !== b.read) return a.read ? 1 : -1;
    return new Date(b.date) - new Date(a.date);
  });

  const filteredNotifications = notifications.sort((a, b) => {
    // Unread first, then by date
    if (a.read !== b.read) return a.read ? 1 : -1;
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <div className="announcements-page">
      <div className="announcements-header">
        <div>
          <h1><FaBullhorn /> Announcements & Notifications</h1>
          <p>Stay updated with latest news and updates</p>
        </div>
        {unreadCount > 0 && (
          <div className="unread-badge">
            <FaBell />
            <span>{unreadCount} Unread</span>
          </div>
        )}
      </div>

      {/* Popup Modal for High Priority Announcements */}
      {showPopup && (
        <div className="announcement-popup-overlay" onClick={() => setShowPopup(null)}>
          <div className="announcement-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setShowPopup(null)}>
              <FaTimes />
            </button>
            <div className="popup-icon" style={{ color: getTypeColor(showPopup.type) }}>
              {getTypeIcon(showPopup.type)}
            </div>
            <h2>{showPopup.title}</h2>
            <p>{showPopup.message}</p>
            <button
              className="popup-mark-read"
              onClick={() => {
                markAsRead(showPopup.id, 'announcement');
                setShowPopup(null);
              }}
            >
              Mark as Read
            </button>
          </div>
        </div>
      )}

      <div className="announcements-content">
        {/* Announcements Section */}
        <div className="announcements-section">
          <div className="section-header">
            <h2><FaBullhorn /> Announcements</h2>
            {announcements.filter(a => !a.read).length > 0 && (
              <button
                className="mark-all-read-btn"
                onClick={() => markAllAsRead('announcement')}
              >
                Mark All as Read
              </button>
            )}
          </div>
          <div className="announcements-list">
            {filteredAnnouncements.length === 0 ? (
              <div className="empty-state">
                <FaBullhorn />
                <p>No announcements</p>
              </div>
            ) : (
              filteredAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`announcement-card ${announcement.read ? 'read' : 'unread'} ${announcement.priority}`}
                  onClick={() => markAsRead(announcement.id, 'announcement')}
                >
                  <div className="announcement-icon" style={{ color: getTypeColor(announcement.type) }}>
                    {getTypeIcon(announcement.type)}
                  </div>
                  <div className="announcement-content">
                    <div className="announcement-header">
                      <h3>{announcement.title}</h3>
                      {!announcement.read && <span className="unread-dot"></span>}
                    </div>
                    <p className="announcement-message">{announcement.message}</p>
                    <div className="announcement-footer">
                      <span className="announcement-date">
                        {new Date(announcement.date).toLocaleString()}
                      </span>
                      <span className={`priority-badge ${announcement.priority}`}>
                        {announcement.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notifications Section */}
        <div className="notifications-section">
          <div className="section-header">
            <h2><FaBell /> Notifications</h2>
            {notifications.filter(n => !n.read).length > 0 && (
              <button
                className="mark-all-read-btn"
                onClick={() => markAllAsRead('notification')}
              >
                Mark All as Read
              </button>
            )}
          </div>
          <div className="notifications-list">
            {filteredNotifications.length === 0 ? (
              <div className="empty-state">
                <FaBell />
                <p>No notifications</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-card ${notification.read ? 'read' : 'unread'} ${notification.type}`}
                  onClick={() => markAsRead(notification.id, 'notification')}
                >
                  <div className="notification-icon">
                    {notification.type === 'commission' && <FaCheckCircle className="icon-success" />}
                    {notification.type === 'withdrawal' && <FaCheckCircle className="icon-success" />}
                    {notification.type === 'team' && <FaInfoCircle className="icon-info" />}
                    {notification.type === 'package' && <FaInfoCircle className="icon-info" />}
                  </div>
                  <div className="notification-content">
                    <div className="notification-header">
                      <h3>{notification.title}</h3>
                      {!notification.read && <span className="unread-dot"></span>}
                    </div>
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-date">
                      {new Date(notification.date).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
