import React, { useState, useEffect } from 'react';
import { FaWallet, FaArrowDown, FaArrowUp, FaCopy, FaQrcode, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import AuthService from '../../Apis/AuthService/AuthService';
import './Wallet.css';

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('deposit'); // 'deposit' or 'withdraw'
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showQR, setShowQR] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('all'); // 'all', 'deposit', 'withdrawal'

  // API data states (replaced static data)
  const [walletData, setWalletData] = useState({
    balance: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    address: '',
  });
  const [transactions, setTransactions] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const [formData, setFormData] = useState({
    amount: '',
    address: '',
    network: 'TRC20',
    memo: ''
  });

  const networks = [
    { id: 'TRC20', name: 'TRC20 (Tron)', fee: '1 USDT', icon: '🔴' },
    { id: 'ERC20', name: 'ERC20 (Ethereum)', fee: '5 USDT', icon: '🔵' },
    { id: 'BEP20', name: 'BEP20 (BSC)', fee: '0.5 USDT', icon: '🟡' },
    { id: 'NGP10', name: 'NGP10 (NGP10)', fee: '0.10 USDT', icon: '🟡' },
  ];

  // Fetch wallet balance and transactions on component mount
  const fetchWalletData = async () => {
    try {
      setPageLoading(true);
      setError('');

      const [balanceRes, txRes] = await Promise.all([
        AuthService.getWalletBalance(),
        AuthService.getTransactions(),
      ]);

      if (balanceRes.success) {
        setWalletData({
          balance: balanceRes.balance || 0,
          pendingDeposits: balanceRes.pendingDeposits || 0,
          pendingWithdrawals: balanceRes.pendingWithdrawals || 0,
          address: balanceRes.address || '',
        });
      } else {
        setError(balanceRes.error || 'Failed to fetch wallet balance');
      }

      if (txRes.success) {
        setTransactions(txRes.transactions || []);
      } else {
        console.error('Failed to fetch transactions:', txRes.error);
      }

    } catch (err) {
      setError('Something went wrong while loading wallet data');
      console.error('Wallet fetch error:', err);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const copyAddress = async () => {

    try {
      setLoading(true)
      await navigator.clipboard.writeText(walletData.address);
      setCopied(true);
      setTimeout(() =>
        setCopied(false)
        , 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = walletData.address; // text area ki value me wallet address add kr diya 
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() =>
        setCopied(false),
        2000);
    } finally {
      setLoading(false)
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      setError('');

      const res = await AuthService.deposit({
        amount: parseFloat(formData.amount),
        network: formData.network,
        memo: formData.memo,
      });

      if (res.success) {
        alert('Deposit request submitted successfully!');
        setFormData({ ...formData, amount: '', memo: '' });
        // Refresh wallet data after deposit
        fetchWalletData();
      } else {
        alert(res.error || 'Deposit request failed');
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
      console.error('Deposit error:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (parseFloat(formData.amount) > walletData.balance) {
      alert('Insufficient balance');
      return;
    }
    try {
      setSubmitLoading(true);
      setError('');

      const res = await AuthService.withdraw({
        amount: parseFloat(formData.amount),
        address: formData.address,
        network: formData.network,
        memo: formData.memo,
      });

      if (res.success) {
        alert('Withdrawal request submitted successfully!');
        setFormData({
          ...formData, // old data copy reset form
          amount: '',
          address: '',
          memo: ''
        });
        // Refresh wallet data after withdrawal
        fetchWalletData();
      } else {
        alert(res.error || 'Withdrawal request failed');
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
      console.error('Withdraw error:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="status-icon completed" />;
      case 'pending':
        return <FaClock className="status-icon pending" />;
      case 'failed':
        return <FaTimesCircle className="status-icon failed" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'var(--success-color, #10b981)';
      case 'pending':
        return 'var(--warning-color, #f59e0b)';
      case 'failed':
        return 'var(--danger-color, #ef4444)';
      default:
        return 'var(--card-text, #94a3b8)';
    }
  };

  // Show loading state while fetching initial data
  if (pageLoading) {
    return (
      <div className="wallet-container">
        <div className="page-header">
          <h1>USDT Wallet</h1>
          <p>Loading wallet data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      <div className="page-header">
        <h1>USDT Wallet</h1>
        <p>Deposit and withdraw USDT using multiple networks</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="wallet-error" style={{ color: '#ef4444', textAlign: 'center', padding: '10px', marginBottom: '16px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Balance Cards */}
      <div className="wallet-balance-cards">
        <div className="balance-card">
          <div className="balance-icon">
            <FaWallet />
          </div>
          <div className="balance-content">
            <div className="balance-label">Total Balance</div>
            <div className="balance-value">{walletData.balance.toFixed(2)} USDT</div>
          </div>
        </div>
        <div className="balance-card">
          <div className="balance-icon pending">
            <FaArrowDown />
          </div>
          <div className="balance-content">
            <div className="balance-label">Pending Deposits</div>
            <div className="balance-value">{walletData.pendingDeposits.toFixed(2)} USDT</div>
          </div>
        </div>
        <div className="balance-card">
          <div className="balance-icon pending">
            <FaArrowUp />
          </div>
          <div className="balance-content">
            <div className="balance-label">Pending Withdrawals</div>
            <div className="balance-value">{walletData.pendingWithdrawals.toFixed(2)} USDT</div>
          </div>
        </div>
      </div>

      {/* Wallet Address Card */}
      <div className="wallet-address-card">
        <h3>Your USDT Wallet Address</h3>
        <div className="network-selector">
          {networks.map((network) => (
            <button
              key={network.id}
              className={`network-btn ${selectedNetwork === network.id ? 'active' : ''}`}
              onClick={() => setSelectedNetwork(network.id)}
            >
              <span className="network-icon">{network.icon}</span>
              <div>
                <div className="network-name">{network.name}</div>
                <div className="network-fee">Fee: {network.fee}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="address-display">
          <div className="address-input-wrapper">
            <input
              type="text"
              value={walletData.address}
              readOnly
              className="address-input"
            />
            <button onClick={copyAddress} className="copy-address-btn">
              {copied ? <FaCheckCircle /> : <FaCopy />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button onClick={() => setShowQR(!showQR)} className="qr-btn">
              <FaQrcode /> QR Code
            </button>
          </div>
          {showQR && (
            <div className="qr-code-container">
              <div className="qr-code-placeholder">
                <FaQrcode />
                <p>QR Code for {selectedNetwork}</p>
                <p className="qr-address">{walletData.address}</p>
              </div>
            </div>
          )}
          <div className="address-warning">
            ⚠️ Only send USDT ({selectedNetwork}) to this address. Sending other cryptocurrencies may result in permanent loss.
          </div>
        </div>
      </div>

      {/* Deposit/Withdraw Tabs */}
      <div className="wallet-tabs">
        <button
          className={`wallet-tab ${activeTab === 'deposit' ? 'active' : ''}`}
          onClick={() => setActiveTab('deposit')}
        >
          <FaArrowDown /> Deposit
        </button>
        <button
          className={`wallet-tab ${activeTab === 'withdraw' ? 'active' : ''}`}
          onClick={() => setActiveTab('withdraw')}
        >
          <FaArrowUp /> Withdraw
        </button>
      </div>

      {/* Deposit Form */}
      {activeTab === 'deposit' && (
        <div className="wallet-form-card">
          <h3>Deposit USDT</h3>
          <form onSubmit={handleDeposit} className="wallet-form">
            <div className="form-group">
              <label>Network</label>
              <select
                name="network"
                value={formData.network}
                onChange={handleInputChange}
                className="form-select"
              >
                {networks.map((network) => (
                  <option key={network.id} value={network.id}>
                    {network.name} (Fee: {network.fee})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Amount (USDT)</label>
              <div className="amount-input-wrapper">

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="10"
                  step="0.01"
                  required
                  className="amount-input"
                />
              </div>
              <div className="quick-amounts">
                <button type="button" onClick={() => setFormData({ ...formData, amount: '50' })}>50</button>
                <button type="button" onClick={() => setFormData({ ...formData, amount: '100' })}>100</button>
                <button type="button" onClick={() => setFormData({ ...formData, amount: '500' })}>500</button>
                <button type="button" onClick={() => setFormData({ ...formData, amount: '1000' })}>1000</button>
              </div>
            </div>
            <div className="form-group">
              <label>Memo (Optional)</label>
              <input
                type="text"
                name="memo"
                value={formData.memo}
                onChange={handleInputChange}
                placeholder="Add a memo for this transaction"
                className="form-input"
              />
            </div>
            <div className="deposit-info">
              <p>📋 Send USDT to the wallet address above</p>
              <p>⏱️ Deposits are processed after 12 confirmations</p>
              <p>💰 Minimum deposit: 10 USDT</p>
            </div>
            <button type="submit" className="submit-btn deposit-btn" disabled={submitLoading}>
              <FaArrowDown /> {submitLoading ? 'Submitting...' : 'Submit Deposit Request'}
            </button>
          </form>
        </div>
      )}

      {/* Withdraw Form */}
      {activeTab === 'withdraw' && (
        <div className="wallet-form-card">
          <h3>Withdraw USDT</h3>
          <form onSubmit={handleWithdraw} className="wallet-form">
            <div className="form-group">
              <label>Network</label>
              <select
                name="network"
                value={formData.network}
                onChange={handleInputChange}
                className="form-select"
              >
                {networks.map((network) => (
                  <option key={network.id} value={network.id}>
                    {network.name} (Fee: {network.fee})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Withdrawal Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your USDT wallet address"
                required
                className="form-input"
              />
              <div className="input-hint">Make sure the address supports {formData.network} network</div>
            </div>
            <div className="form-group">
              <label>Amount (USDT)</label>
              <div className="amount-input-wrapper">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="10"
                  step="0.01"
                  max={walletData.balance}
                  required
                  className="amount-input"
                />
              </div>
              <div className="balance-info">
                Available: <strong>{walletData.balance.toFixed(2)} USDT</strong>
                <button
                  type="button"
                  className="max-btn"
                  onClick={() => setFormData({ ...formData, amount: walletData.balance.toString() })}
                >
                  Max
                </button>
              </div>
              <div className="quick-amounts">
                <button type="button" onClick={() => setFormData({ ...formData, amount: '50' })}>50</button>
                <button type="button" onClick={() => setFormData({ ...formData, amount: '100' })}>100</button>
                <button type="button" onClick={() => setFormData({ ...formData, amount: '500' })}>500</button>
                <button type="button" onClick={() => setFormData({ ...formData, amount: walletData.balance.toString() })}>All</button>
              </div>
            </div>
            <div className="form-group">
              <label>Memo (Optional)</label>
              <input
                type="text"
                name="memo"
                value={formData.memo}
                onChange={handleInputChange}
                placeholder="Add a memo for this transaction"
                className="form-input"
              />
            </div>
            <div className="withdrawal-summary">
              <div className="summary-row">
                <span>Amount:</span>
                <span>{formData.amount || '0.00'} USDT</span>
              </div>
              <div className="summary-row">
                <span>Network Fee:</span>
                <span>{networks.find(n => n.id === formData.network)?.fee || '0 USDT'}</span>
              </div>
              <div className="summary-row total">
                <span>You will receive:</span>
                <span>
                  {formData.amount
                    ? (parseFloat(formData.amount) - parseFloat(networks.find(n => n.id === formData.network)?.fee.replace(' USDT', '') || 0)).toFixed(2)
                    : '0.00'} USDT
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="submit-btn withdraw-btn"
              disabled={submitLoading || !formData.amount || parseFloat(formData.amount) < 10 || parseFloat(formData.amount) > walletData.balance}
            >
              <FaArrowUp /> {submitLoading ? 'Submitting...' : 'Submit Withdrawal Request'}
            </button>
          </form>
        </div>
      )}

      {/* Transaction History */}
      <div className="wallet-history-card">
        <h3>Transaction History</h3>
        <div className="history-filters">
          <button
            className={`filter-btn ${historyFilter === 'all' ? 'active' : ''}`}
            onClick={() => setHistoryFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${historyFilter === 'deposit' ? 'active' : ''}`}
            onClick={() => setHistoryFilter('deposit')}
          >
            Deposits
          </button>
          <button
            className={`filter-btn ${historyFilter === 'withdrawal' ? 'active' : ''}`}
            onClick={() => setHistoryFilter('withdrawal')}
          >
            Withdrawals
          </button>



        </div>
        <div className="transactions-table">
          <div className="table-header">
            <div className="table-cell">Type</div>
            <div className="table-cell">Amount</div>
            <div className="table-cell">Network</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">Date</div>
            <div className="table-cell">TX Hash</div>
          </div>
          {transactions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
              No transactions found
            </div>
          )}
          {transactions
            .filter(tx => {
              if (historyFilter === 'all') return true;
              return tx.type === historyFilter;
            })
            .map((tx) => (
              <div key={tx.id || tx._id} className="table-row">
                <div className="table-cell" data-label="Type">
                  <span className={`tx-type ${tx.type}`}>
                    {tx.type === 'deposit' ? <FaArrowDown /> : <FaArrowUp />}
                    {tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                  </span>
                </div>
                <div className="table-cell amount" data-label="Amount">
                  {parseFloat(tx.amount).toFixed(2)} USDT
                </div>
                <div className="table-cell" data-label="Network">
                  <span className="network-badge">{tx.network}</span>
                </div>
                <div className="table-cell" data-label="Status">
                  <span
                    className="status-badge"
                    style={{ color: getStatusColor(tx.status) }}
                  >
                    {getStatusIcon(tx.status)}
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </span>
                </div>
                <div className="table-cell" data-label="Date">
                  {new Date(tx.date || tx.createdAt).toLocaleString()}
                </div>
                <div className="table-cell" data-label="TX Hash">
                  <div className="tx-hash">
                    {tx.txHash ? (
                      <>
                        {tx.txHash.substring(0, 10)}...{tx.txHash.substring(tx.txHash.length - 8)}
                        <button
                          className="copy-tx-btn"
                          onClick={async (e) => {
                            try {
                              await navigator.clipboard.writeText(tx.txHash);
                              // Show visual feedback instead of alert
                              const btn = e.target.closest('.copy-tx-btn') || e.currentTarget;
                              if (btn) {
                                const originalHTML = btn.innerHTML;
                                btn.innerHTML = '<FaCheckCircle />';
                                btn.style.color = 'var(--success-color, #10b981)';
                                setTimeout(() => {
                                  btn.innerHTML = originalHTML;
                                  btn.style.color = '';
                                }, 2000);
                              }
                            } catch (err) {
                              console.error('Failed to copy:', err);
                              // Fallback for older browsers
                              const textArea = document.createElement('textarea');
                              textArea.value = tx.txHash;
                              document.body.appendChild(textArea);
                              textArea.select();
                              document.execCommand('copy');
                              document.body.removeChild(textArea);
                              // Show feedback even on fallback
                              const btn = e.target.closest('.copy-tx-btn') || e.currentTarget;
                              if (btn) {
                                const originalHTML = btn.innerHTML;
                                btn.innerHTML = '<FaCheckCircle />';
                                btn.style.color = 'var(--success-color, #10b981)';
                                setTimeout(() => {
                                  btn.innerHTML = originalHTML;
                                  btn.style.color = '';
                                }, 2000);
                              }
                            }
                          }}
                        >
                          <FaCopy />
                        </button>
                      </>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>—</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
