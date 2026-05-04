import React, { useState, useEffect } from 'react';
import './Referrals.css';
import AuthService from '../../Apis/AuthService/AuthService';

const Referrals = ({ user }) => {

  const [copied, setCopied] = useState(false);

  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(false);

  const [referralInfo, setReferralInfo] = useState({
    referralCode: '',
    referralLink: ''
  });

  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeReferrals: 0,
    pendingReferrals: 0,
    totalEarnings: 0
  });

  const referralCode = referralInfo?.referralCode || '';
  const referralLink = referralInfo?.referralLink || '';

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        setLoading(true);

        const response = await AuthService.getReferrals();
        const data = response?.data;

        if (data) {
          setReferrals(data.referralList || []);
          setReferralInfo(data.referralInfo || {});
          setStats(data.stats || {});
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="referrals-container">

      {/* HEADER */}
      <div className="page-header">
        <h1>My Referrals</h1>
        <p>Manage and track your referrals</p>
      </div>

      {/* SHARE CARD */}
      <div className="referral-share-card">
        <h2>Share Your Referral Link</h2>

        <div className="referral-link-container">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="referral-link-input"
          />
          <button onClick={copyToClipboard} className="copy-button">
            {copied ? '✓ Copied!' : 'Copy Link'}
          </button>
        </div>

        <div className="referral-code-display">
          <span className="code-label">Your Referral Code:</span>
          <span className="code-value">{referralCode}</span>
        </div>
      </div>

      {/* STATS (FIXED) */}
      <div className="referrals-stats">

        <div className="stat-box">
          <div className="stat-number">{stats.totalReferrals}</div>
          <div className="stat-text">Total Referrals</div>
        </div>

        <div className="stat-box">
          <div className="stat-number">{stats.activeReferrals}</div>
          <div className="stat-text">Active Referrals</div>
        </div>

        <div className="stat-box">
          <div className="stat-number">
            ${stats.totalEarnings ?? 0}
          </div>
          <div className="stat-text">Total Earnings</div>
        </div>

      </div>

      {/* LIST */}
      <div className="referrals-list-card">
        <h2>Referral List</h2>

        <div className="referrals-table">

          {/* HEADER */}
          <div className="table-header">
            <div className="table-cell">Name</div>
            <div className="table-cell">Email</div>
            <div className="table-cell">Join Date</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">Earnings</div>
          </div>

          {/* BODY */}
          {loading ? (
            <div className="table-row" style={{ justifyContent: 'center', padding: '20px' }}>
              Loading referrals...
            </div>
          ) : referrals.length === 0 ? (
            <div className="table-row" style={{ justifyContent: 'center', padding: '20px' }}>
              No referrals found.
            </div>
          ) : (
            referrals.map((referral, i) => (
              <div key={referral.id ?? i} className="table-row">

                <div className="table-cell" data-label="Name">
                  <div className="user-avatar">
                    {referral.name?.charAt(0) || 'U'}
                  </div>
                  <span>{referral.name}</span>
                </div>

                <div className="table-cell" data-label="Email">
                  {referral.email}
                </div>

                <div className="table-cell" data-label="Join Date">
                  {new Date(referral.joinDate).toLocaleDateString()}
                </div>

                <div className="table-cell" data-label="Status">
                  <span className={`status-badge ${referral.status?.toLowerCase() || ''}`}>
                    {referral.status}
                  </span>
                </div>

                <div className="table-cell earnings" data-label="Earnings">
                  ${referral.amountInvested ?? 0}
                </div>

              </div>
            ))
          )}

        </div>
      </div>

    </div>
  );
};

export default Referrals;