import React, { useState, useEffect } from 'react';
import BasePage from '../Pages/BasePage';
import { FaMoneyBillWave, FaWallet, FaCreditCard, FaMobileAlt, FaBitcoin } from 'react-icons/fa';
import AuthService from '../../Apis/AuthService/AuthService';
import LoaderHelper from '../../utils/Loading/LoaderHelper';
import { alertErrorMessage, alertSuccessMessage } from '../../utils/CustomAlertMessage/index';
import './Payout.css';

const Payout = ({ user }) => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: '',
    ifsc: '',
    accountName: '',
    upi: '',
    cryptoAddress: ''
  });

  const [walletBalance, setWalletBalance] = useState(0);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);

  const minWithdraw = 50;
  const maxWithdraw = 10000;
  const adminCharges = 2.5; // 2.5%
  const tds = 5; // 5%

  useEffect(() => {
    fetchPayoutData();
  }, []);

  const fetchPayoutData = async () => {
    try {
      LoaderHelper.loaderStatus(true);

      // 1. Dashboard API se Available Balance get karna
      const dashboardResult = await AuthService.getDashboardData();
      if (dashboardResult?.success) {
        const dashData = Array.isArray(dashboardResult.data) ? dashboardResult.data[0] : dashboardResult.data;
        const balance = dashData?.dashboardStats?.availableBalance;

        setWalletBalance(
          balance !== undefined && balance !== null
            ? parseFloat(balance)
            : 0
        );
      }

      // 2. Withdrawal History API (Transaction History)
      const historyResult = await AuthService.getWithdrawalHistory();
      if (historyResult?.success) {
        const historyData = historyResult?.data;
        const history = historyData?.withdrawalHistory ?? historyData?.withdrawals ?? historyData?.history ?? historyData ?? [];
        setWithdrawalHistory(Array.isArray(history) ? history : []);
      }

    } catch (error) {
      alertErrorMessage('Something went wrong while fetching payout data.');
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  // ================= CHARGES CALCULATE =================
  const calculateCharges = (amount) => {
    const admin = (amount * adminCharges) / 100;
    const tdsAmount = (amount * tds) / 100;
    const totalCharges = admin + tdsAmount;
    const netAmount = amount - totalCharges;
    return { admin, tdsAmount, totalCharges, netAmount };
  };

  // ================= WITHDRAW — API CALL =================
  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
   
    if (!amount || isNaN(amount)) {
      alertErrorMessage('Please enter a valid amount');
      return;
    }

    if (amount < minWithdraw || amount > maxWithdraw) {
      alertErrorMessage(`Amount must be between $${minWithdraw} and $${maxWithdraw}`);
      return;
    }

    if (paymentMethod === "bank") {
      const { accountName, ifsc, accountNumber } = accountDetails;
      if (!accountName || !ifsc || !accountNumber) {
        alertErrorMessage("Please fill all bank details");
        return;
      }
    }

    if (paymentMethod === "upi") {
      if (!accountDetails.upi) {
        alertErrorMessage("Please enter UPI ID");
        return;
      }
    }

    if (paymentMethod === "crypto") {
      if (!accountDetails.cryptoAddress) {
        alertErrorMessage("Please enter crypto address");
        return;
      }
    }

    if (amount > Number(walletBalance || 0)) {
      alertErrorMessage('Insufficient balance');
      return;
    }

    // API call
    try {
      LoaderHelper.loaderStatus(true);

      const result = await AuthService.submitWithdrawal({
        amount: amount,
        method: paymentMethod,
        details: accountDetails,
      });

      if (result?.success) {
        alertSuccessMessage(result?.message || 'Withdrawal request submitted successfully!');

        // Form reset
        setWithdrawAmount('');
        setAccountDetails({
          accountNumber: '',
          ifsc: '',
          accountName: '',
          upi: '',
          cryptoAddress: ''
        });

        // Fresh data fetch karo
        fetchPayoutData();
      } else {
        alertErrorMessage(result?.message || result?.error || 'Withdrawal failed. Please try again.');
      }
    } catch (error) {
      alertErrorMessage('Something went wrong during withdrawal.');
    } finally {
      LoaderHelper.loaderStatus(false);
    }
  };

  const charges = withdrawAmount ? calculateCharges(parseFloat(withdrawAmount)) : null;

  return (
    <BasePage
      title="Withdraw / Payout"
      subtitle="Manage payouts and withdrawals"
      icon={<FaMoneyBillWave />}
    >
      <div className="payout-content">
        <div className="payout-section">
          <div className="wallet-balance-card">
            <FaWallet />
            <div>
              <div className="balance-label">Available Balance</div>
              <div className="balance-amount">${walletBalance.toFixed(2)}</div>
            </div>
          </div>

          <div className="withdraw-form-card">
            <h3>Request Withdrawal</h3>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder={`Min: $${minWithdraw}, Max: $${maxWithdraw}`}
                min={minWithdraw}
                max={maxWithdraw}
              />
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <div className="payment-methods">
                <button
                  className={paymentMethod === 'bank' ? 'active' : ''}
                  onClick={() => setPaymentMethod('bank')}
                >
                  <FaCreditCard /> Bank Transfer
                </button>
                <button
                  className={paymentMethod === 'upi' ? 'active' : ''}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <FaMobileAlt /> UPI
                </button>
                <button
                  className={paymentMethod === 'crypto' ? 'active' : ''}
                  onClick={() => setPaymentMethod('crypto')}
                >
                  <FaBitcoin /> Crypto
                </button>
              </div>
            </div>

            {paymentMethod === 'bank' && (
              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  value={accountDetails.accountNumber}
                  onChange={(e) => setAccountDetails({ ...accountDetails, accountNumber: e.target.value })}
                  placeholder="Enter account number"
                />
                <label>IFSC Code</label>
                <input
                  type="text"
                  value={accountDetails.ifsc}
                  onChange={(e) => setAccountDetails({ ...accountDetails, ifsc: e.target.value })}
                  placeholder="Enter IFSC code"
                />
                <label>Account Name</label>
                <input
                  type="text"
                  value={accountDetails.accountName}
                  onChange={(e) => setAccountDetails({ ...accountDetails, accountName: e.target.value })}
                  placeholder="Enter account holder name"
                />
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="form-group">
                <label>UPI ID</label>
                <input
                  type="text"
                  value={accountDetails.upi}
                  onChange={(e) => setAccountDetails({ ...accountDetails, upi: e.target.value })}
                  placeholder="Enter UPI ID"
                />
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="form-group">
                <label>Crypto Address</label>
                <input
                  type="text"
                  value={accountDetails.cryptoAddress}
                  onChange={(e) => setAccountDetails({ ...accountDetails, cryptoAddress: e.target.value })}
                  placeholder="Enter crypto wallet address"
                />
              </div>
            )}

            {charges && (
              <div className="charges-breakdown">
                <div className="charge-item">
                  <span>Admin Charges ({adminCharges}%)</span>
                  <span>${charges.admin.toFixed(2)}</span>
                </div>
                <div className="charge-item">
                  <span>TDS ({tds}%)</span>
                  <span>${charges.tdsAmount.toFixed(2)}</span>
                </div>
                <div className="charge-item total">
                  <span>Net Amount</span>
                  <span>${charges.netAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            <button className="withdraw-btn" onClick={handleWithdraw}>
              Request Withdrawal
            </button>
          </div>
        </div>

        <div className="withdrawal-history">
          <h3>Withdrawal History</h3>
          <div className="history-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Charges</th>
                  <th>Net Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawalHistory.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                      No withdrawal history found
                    </td>
                  </tr>
                ) : (
                  withdrawalHistory.map((item) => (
                    <tr key={item._id || item.id}>
                      <td data-label="Date">{new Date(item.date || item.createdAt).toLocaleDateString()}</td>
                      <td data-label="Amount">${Number(item.amount || 0).toFixed(2)}</td>
                      <td data-label="Method">{item.method || item.paymentMethod || '-'}</td>
                      <td data-label="Charges">${Number(item.charges || item.totalCharges || 0).toFixed(2)}</td>
                      <td data-label="Net Amount">${Number(item.netAmount || item.receivedAmount || 0).toFixed(2)}</td>
                      <td data-label="Status">
                        <span className={`status-badge ${(item.status || 'pending').toLowerCase()}`}>
                          {item.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </BasePage>
  );
};

export default Payout;

