import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { WALLET_TYPES, walletToWalletTransfer, setWallets, setTransactions, setTransferHistory } from '../../store/slices/walletSlice';
import { FaWallet, FaExchangeAlt, FaArrowRight, FaHistory } from 'react-icons/fa';
import AuthService from '../../Apis/AuthService/AuthService';
import LoaderHelper from '../../utils/Loading/LoaderHelper';
import { alertErrorMessage, alertSuccessMessage } from '../../utils/CustomAlertMessage/index';
import './EnhancedWallet.css';

const EnhancedWallet = ({ user }) => {
  const dispatch = useAppDispatch();
  const { wallets, transactions, transferHistory } = useAppSelector((state) => state.wallet);
  const [activeWallet, setActiveWallet] = useState(WALLET_TYPES.MAIN);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Transfer form ka data store

  const [transferData, setTransferData] = useState({
    fromWallet: WALLET_TYPES.MAIN,
    toWallet: WALLET_TYPES.INCOME,
    amount: '',
    description: '',
  });

  useEffect(() => {
    fetchWalletData();
  }, []);

  // API se wallet dashboard data fetch karna (1 API me sab aata hai)
  const fetchWalletData = async () => {
    try {
      LoaderHelper.loaderStatus(true);

      const result = await AuthService.getWalletDashboard();

      if (result?.success) {
        const data = result?.data;

        // Backend response: data.wallets = { main, income, roi, fund }
        const w = data?.wallets || {};

        const walletData = {
          [WALLET_TYPES.MAIN]: {
            type: WALLET_TYPES.MAIN,
            name: 'Main Wallet',
            balance: Number(w?.main?.balance ?? 0),
            pending: Number(w?.main?.pending ?? 0),
          },
          [WALLET_TYPES.INCOME]: {
            type: WALLET_TYPES.INCOME,
            name: 'Income Wallet',
            balance: Number(w?.income?.balance ?? 0),
            pending: Number(w?.income?.pending ?? 0),
          },
          [WALLET_TYPES.ROI]: {
            type: WALLET_TYPES.ROI,
            name: 'ROI Wallet',
            balance: Number(w?.roi?.balance ?? 0),
            pending: Number(w?.roi?.pending ?? 0),
          },
          [WALLET_TYPES.FUND]: {
            type: WALLET_TYPES.FUND,
            name: 'Fund Wallet',
            balance: Number(w?.fund?.balance ?? 0),
            pending: Number(w?.fund?.pending ?? 0),
          },
        };
        dispatch(setWallets(walletData));

        // Backend response: data.transactions = [{ id, type, walletType, description, amount, status, date }]
        const txData = data?.transactions ?? [];
        dispatch(setTransactions(Array.isArray(txData) ? txData : []));

      } else {
        alertErrorMessage(result?.message || result?.error || 'Failed to fetch wallet data');
      }

    } catch (error) {
      alertErrorMessage('Something went wrong while fetching wallet data.');
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };


  const walletList = [
    { type: WALLET_TYPES.MAIN, name: 'Main Wallet', icon: '💳', color: 'var(--primary-color, #6366f1)' },
    { type: WALLET_TYPES.INCOME, name: 'Income Wallet', icon: '💰', color: 'var(--success-color, #10b981)' },
    { type: WALLET_TYPES.ROI, name: 'ROI Wallet', icon: '📈', color: 'var(--warning-color, #f59e0b)' },
    { type: WALLET_TYPES.FUND, name: 'Fund Wallet', icon: '💵', color: '#ec4899' },
  ];

  const handleTransfer = async (e) => {
    e.preventDefault();

    // string format convert into number format
    const amount = parseFloat(transferData.amount);
    const fromWalletBalance = wallets?.[transferData.fromWallet]?.balance || 0;

    if (amount > 0 && amount <= fromWalletBalance) {
      try {
        LoaderHelper.loaderStatus(true);

        // API call for wallet transfer
        const result = await AuthService.walletTransfer({
          fromWallet: transferData.fromWallet,
          toWallet: transferData.toWallet,
          amount: amount,
          description: transferData.description || '',
        });

        if (result?.success) {
          // Local Redux state bhi update karo
          dispatch(walletToWalletTransfer({
            fromWallet: transferData.fromWallet,
            toWallet: transferData.toWallet,
            amount: amount,
            description: transferData.description || '',
          }));

          alertSuccessMessage(result?.message || 'Transfer successful!');
          setShowTransferModal(false);
          setTransferData({
            fromWallet: WALLET_TYPES.MAIN,
            toWallet: WALLET_TYPES.INCOME,
            amount: '',
            description: '',
          });

          // Transfer ke baad fresh data fetch karo
          fetchWalletData();
        } else {
          alertErrorMessage(result?.error || 'Transfer failed. Please try again.');
        }
      } catch (error) {
        alertErrorMessage('Something went wrong during transfer.');
      } finally {
        LoaderHelper.loaderStatus(false);
      }
    } else {
      alertErrorMessage('Invalid amount. Please check your balance.');
    }
  };

  const totalBalance = Object.values(wallets || {}).reduce((sum, wallet) => sum + (wallet?.balance || 0), 0);
  const totalPending = Object.values(wallets || {}).reduce((sum, wallet) => sum + (wallet?.pending || 0), 0);

const walletTransactions = (transactions || []).filter(
  t =>
    t.walletType === activeWallet ||
    t.walletType === 'internal'
);
  return (
    <div className="enhanced-wallet">
      <div className="wallet-header">
        <div>
          <h1><FaWallet /> Enhanced Wallet Management</h1>
          <p>Manage all your wallets in one place</p>
        </div>
        <button className="transfer-btn" onClick={() => setShowTransferModal(true)}>
          <FaExchangeAlt /> Wallet Transfer
        </button>
      </div>

      {/* Total Balance Summary */}
      <div className="total-balance-card">
        <div className="total-balance-item">
          <div className="total-label">Total Balance</div>
          <div className="total-value">${totalBalance.toFixed(2)}</div>
        </div>
        <div className="total-balance-item">
          <div className="total-label">Total Pending</div>
          <div className="total-value pending">${totalPending.toFixed(2)}</div>
        </div>
        <div className="total-balance-item">
          <div className="total-label">Available Balance</div>
          <div className="total-value available">${(totalBalance - totalPending).toFixed(2)}</div>
        </div>
      </div>

      {/* Wallet Cards */}
      <div className="wallets-grid">
        {walletList.map((wallet) => (
          <div
            key={wallet.type}
            className={`wallet-card ${activeWallet === wallet.type ? 'active' : ''}`}
            onClick={() => setActiveWallet(wallet.type)}
            style={{ borderColor: wallet.color }}
          >
            <div className="wallet-card-header">
              <div className="wallet-icon" style={{ color: wallet.color }}>
                {wallet.icon}
              </div>
              <div className="wallet-info">
                <div className="wallet-name">{wallet.name}</div>
                <div className="wallet-balance">${(wallets?.[wallet.type]?.balance || 0).toFixed(2)|| '0.00'}</div>
              </div>
            </div>
            <div className="wallet-pending">
              Pending: ${(wallets?.[wallet.type]?.pending || 0).toFixed(2)|| '0.00'}
            </div>
          </div>
        ))}
      </div>

      {/* Active Wallet Details */}
      <div className="wallet-details-section">
        <div className="wallet-details-header">
          <h2>{walletList.find(w => w.type === activeWallet)?.name} Details</h2>
          <div className="wallet-actions">
            <button className="action-btn">
              <FaHistory /> Transaction History
            </button>
          </div>
        </div>

        <div className="wallet-stats">
          <div className="stat-item">
            <div className="stat-label">Available Balance</div>
            <div className="stat-value">
              ${((wallets?.[activeWallet]?.balance || 0) - (wallets?.[activeWallet]?.pending || 0)).toFixed(2)}
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Total Balance</div>
            <div className="stat-value">${wallets?.[activeWallet]?.balance.toFixed(2) || '0.00'}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Pending Amount</div>
            <div className="stat-value pending">${wallets?.[activeWallet]?.pending.toFixed(2) || '0.00'}</div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="transactions-section">
          <h3>Recent Transactions</h3>
          <div className="transactions-list">
            {walletTransactions.length === 0 ? (
              <div className="no-transactions">
                <FaHistory />
                <p>No transactions found</p>
              </div>
            ) : (
              walletTransactions.slice(0, 10).map((transaction) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-icon">
                    {transaction.type === 'credit' ? '↑' : '↓'}
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-description">{transaction.description}</div>
                    <div className="transaction-date">
                      {new Date(transaction.date).toLocaleString()}
                    </div>
                  </div>
                 <div
  className={`transaction-amount ${
    transaction.type === 'credit'
      ? 'credit'
      : transaction.type === 'debit'
      ? 'debit'
      : 'transfer'
  }`}
>
  {transaction.type === 'credit'
    ? '+'
    : transaction.type === 'debit'
    ? '-'
    : '↔'}$
  {(transaction.amount || 0).toFixed(2)}
</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <TransferModal
          transferData={transferData}
          wallets={wallets}
          walletList={walletList}
          onClose={() => setShowTransferModal(false)}
          onChange={(data) => setTransferData(data)}
          onSubmit={handleTransfer}
        />
      )}
    </div>
  );
};

// Transfer Modal Component
const TransferModal = ({ transferData, wallets, walletList, onClose, onChange, onSubmit }) => {
  const handleInputChange = (field, value) => {
    onChange({ ...transferData, [field]: value });
  };

  const maxAmount = wallets?.[transferData.fromWallet]?.balance || 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content wallet-transfer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2><FaExchangeAlt /> Wallet to Wallet Transfer</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={onSubmit} className="transfer-form">
          <div className="form-group">
            <label>From Wallet</label>
            <select
              value={transferData.fromWallet}
              onChange={(e) => handleInputChange('fromWallet', e.target.value)}
              required
            >
              {walletList.map(wallet => (
                <option key={wallet.type} value={wallet.type}>
                  {wallet.name} (${wallets?.[wallet.type]?.balance.toFixed(2) || '0.00'})
                </option>
              ))}
            </select>
          </div>
          <div className="transfer-arrow">
            <FaArrowRight />
          </div>
          <div className="form-group">
            <label>To Wallet</label>
            <select
              value={transferData.toWallet}
              onChange={(e) => handleInputChange('toWallet', e.target.value)}
              required
            >
              {walletList
                //Main → Main transfer na kar de.
                .filter(wallet => wallet.type !== transferData.fromWallet)
                .map(wallet => (
                  <option key={wallet.type} value={wallet.type}>
                    {wallet.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label>Amount</label>
            <div className="amount-input-wrapper">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                value={transferData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                min="0.01"
                max={maxAmount}
                step="0.01"
                required
                className="amount-input"
              />
            </div>
            <div className="balance-info">
              Available: <strong>${maxAmount.toFixed(2)}</strong>
              <button
                type="button"
                className="max-btn"
                onClick={() => handleInputChange('amount', maxAmount.toString())}
              >
                Max
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Description (Optional)</label>
            <input
              type="text"
              value={transferData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Add a note for this transfer"
            />
          </div>
          <div className="transfer-summary">
            <div className="summary-row">
              <span>From:</span>


              {/* //find() first matching element   return karta h */}

              <span>{walletList.find(w => w.type === transferData.fromWallet)?.name}</span>
            </div>
            <div className="summary-row">
              <span>To:</span>
              <span>{walletList.find(w => w.type === transferData.toWallet)?.name}</span>
            </div>
            <div className="summary-row">
              <span>Amount:</span>
              <span>${transferData.amount || '0.00'}</span>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
            <button
              type="submit"
              className="btn-submit"
              disabled={!transferData.amount || parseFloat(transferData.amount) <= 0 || parseFloat(transferData.amount) > maxAmount}
            >
              <FaExchangeAlt /> Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedWallet;