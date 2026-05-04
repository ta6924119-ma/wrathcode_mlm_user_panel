import React, { useState, useEffect } from 'react';
import { FaTicketAlt, FaPlus, FaSearch, FaFilter, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaPaperclip, FaReply } from 'react-icons/fa';
import './SupportTickets.css';
import AuthService from '../../Apis/AuthService/AuthService';
import { tickIncrement } from 'd3';

const SupportTickets = ({ user }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filter, setFilter] = useState('all'); // all, open, pending, resolved, closed
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTickets = async () => {
    console.log("🚀 Fetching tickets...");
    setLoading(true);

    const response = await AuthService.getSupportTickets();

    console.log("📦 Raw API Response:", response);

    if (response.success) {
      const dataList = response.tickets || [];
      console.log("✅ Parsed Tickets:", dataList);
      console.log("📊 Tickets Count:", dataList.length);

      setTickets(dataList);
    } else {
      console.error("❌ Failed to fetch tickets:", response.error);
    }

    setLoading(false);
    console.log("🏁 Fetch tickets complete");
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const categories = ['All', 'Financial', 'Package', 'Income', 'Technical', 'Account', 'Other'];
  const priorities = ['low', 'medium', 'high', 'urgent'];

  // 


  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === 'all' || ticket.status === filter;

    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNo.toLowerCase().includes(searchQuery.toLowerCase());

    const result = matchesFilter && matchesSearch;

    console.log("🔎 Filtering Ticket:", {
      ticket,
      matchesFilter,
      matchesSearch,
      result
    });

    return result;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <FaClock className="status-icon open" />;
      case 'pending':
        return <FaExclamationCircle className="status-icon pending" />;
      case 'resolved':
        return <FaCheckCircle className="status-icon resolved" />;
      case 'closed':
        return <FaTimesCircle className="status-icon closed" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'var(--danger-color, #ef4444)';
      case 'high':
        return 'var(--warning-color, #f59e0b)';
      case 'medium':
        return 'var(--primary-color, #6366f1)';
      case 'low':
        return 'var(--success-color, #10b981)';
      default:
        return 'var(--card-text, #94a3b8)';
    }
  };

  const handleCreateTicket = async (ticketData) => {
    console.log("📤 Creating Ticket:", ticketData);

    setLoading(true);
    const response = await AuthService.createSupportTicket(ticketData);

    console.log("📥 Create Ticket Response:", response);

    if (response.success) {
      console.log("✅ Ticket created successfully");
      await fetchTickets();
      setShowCreateModal(false);
    } else {
      console.error("❌ Create failed:", response.error);
      alert(response.error || "Failed to create ticket.");
    }

    setLoading(false);
  };

  return (
    <div className="support-tickets">
      <div className="support-header">
        <div>
          <h1><FaTicketAlt /> Support & Help Desk</h1>
          <p>Create and manage your support tickets</p>
        </div>
        <button className="create-ticket-btn" onClick={() => setShowCreateModal(true)}>
          <FaPlus /> Create New Ticket
        </button>
      </div>

      {/* Filters and Search */}
      <div className="support-filters">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'open' ? 'active' : ''}`}
            onClick={() => setFilter('open')}
          >
            Open
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === 'resolved' ? 'active' : ''}`}
            onClick={() => setFilter('resolved')}
          >
            Resolved
          </button>
          <button
            className={`filter-btn ${filter === 'closed' ? 'active' : ''}`}
            onClick={() => setFilter('closed')}
          >
            Closed
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="tickets-list">
        {loading ? (
          <div className="no-tickets">
            <FaClock className="spin" />
            <p>Loading tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="no-tickets">
            <FaTicketAlt />
            <p>No tickets found</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket._id}
              className={`ticket-card ${ticket.status}`}
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="ticket-header">
                <div className="ticket-info">
                  <div className="ticket-number">{ticket.ticketId}</div>
                  <div className="ticket-subject">{ticket.subject}</div>
                </div>
                <div className="ticket-meta">
                  {getStatusIcon(ticket.status)}
                  <span className="ticket-status">{ticket.status}</span>
                </div>
              </div>
              <div className="ticket-details">
                <div className="ticket-category">
                  <span>Category:</span> {ticket.category}
                </div>
                <div
                  className="ticket-priority"
                  style={{ color: getPriorityColor(ticket.priority) }}
                >
                  <span>Priority:</span> {ticket.priority}
                </div>
                <div className="ticket-date">
                  Created: {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
              </div>
              {ticket.replies.length > 0 && (
                <div className="ticket-replies-count">
                  {ticket.replies.length}  {ticket.replies.length === 1 ? 'reply' : 'replies'}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <CreateTicketModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTicket}
          categories={categories}
          priorities={priorities}
          loading={loading}
        />
      )}



      {/* Ticket Detail Modal */}
      {
        selectedTicket && (
          <TicketDetailModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            onReply={async (replyMessage) => {
              const response = await AuthService.replySupportTicket({
                ticketId: selectedTicket.id || selectedTicket._id,
                message: replyMessage
              });

              if (response.success) {
                await fetchTickets();
                // Simple state update fallback for instant UI response
                setSelectedTicket({
                  ...selectedTicket,
                  replies: [...(selectedTicket.replies || []), {
                    id: Date.now().toString(),
                    message: replyMessage,
                    from: 'You',
                    date: new Date().toISOString()
                  }],
                  updatedAt: new Date().toISOString(),
                });
              } else {
                alert(response.error || "Failed to send reply");
              }
            }}
          />
        )}
    </div>
  );
};

// Create Ticket Modal Component
const CreateTicketModal = ({ onClose, onSubmit, categories, priorities, loading }) => {
  const [formData, setFormData] = useState({
    subject: '',
    category: categories[1],
    priority: 'medium',
    description: '',
    attachments: [],

  });





  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.subject && formData.description) {
      onSubmit(formData);
      setFormData({
        subject: '',
        category: categories[1],
        priority: 'medium',
        description: '',
        attachments: [],
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Ticket</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-group">
            <label>Subject *</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {categories.slice(1).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Priority *</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                required
              >
                {priorities.map(pri => (
                  <option key={pri} value={pri}>{pri}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="5"
              required
            />
          </div>
          <div className="form-group">
            <label>Attachments</label>
            <div className="file-upload">
              <FaPaperclip />
              <span>Click to upload files</span>
              <input type="file" multiple />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span> Creating Ticket
                </>
              ) : (
                "Create Ticket"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Ticket Detail Modal Component
const TicketDetailModal = ({ ticket, onClose, onReply }) => {
  const [replyMessage, setReplyMessage] = useState('');

  const handleReply = (e) => {
    e.preventDefault();
    if (replyMessage.trim()) {
      onReply(replyMessage);
      setReplyMessage('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content ticket-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{ticket.ticketId} - {ticket.subject}</h2>
            <div className="ticket-meta-info">
              <span>Category: {ticket.category}</span>
              <span>Priority: {ticket.priority}</span>
              <span>Status: {ticket.status}</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="ticket-detail-content">
          <div className="ticket-description">
            <h3>Description</h3>
            <p>{ticket.description}</p>
            <div className="ticket-dates">
              <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
              <span>Updated: {new Date(ticket.updatedAt).toLocaleString()}</span>
            </div>
          </div>
          {ticket.replies.length > 0 && (
            <div className="ticket-replies">
              <h3>Replies ({ticket.replies.length})</h3>
              {ticket.replies.map((reply) => (
                <div key={reply.id} className="reply-item">
                  <div className="reply-header">
                    <span className="reply-from">{reply.from}</span>
                    <span className="reply-date">{new Date(reply.date).toLocaleString()}</span>
                  </div>
                  <div className="reply-message">{reply.message}</div>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={handleReply} className="reply-form">
            <div className="form-group">
              <label>Add Reply</label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows="3"
                placeholder="Type your reply here..."
              />
            </div>
            <button type="submit" className="btn-reply">
              <FaReply /> Send Reply
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;
