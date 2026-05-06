import React, { useEffect, useState } from "react";
import BasePage from "../Pages/BasePage";
import "./Deposit.css";
import { FaWallet, FaCreditCard, FaMobileAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import AuthService from "../../Apis/AuthService/AuthService";

const DepositWallet = () => {
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const [accountDetails, setAccountDetails] = useState({
    amount: "",
    accountHolder: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    upi: "",
  });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const response = await AuthService.getDepositHistory();

      console.log("HISTORY RESPONSE =>", response);

      if (response?.success) {

        setHistory(response?.deposits || []);

      } else {

        toast(
          response?.message || "Failed to fetch history"
        );
      }

    } catch (error) {

      console.log(error);

      toast("Error fetching history");

    } finally {

      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    try {
      const { amount } = accountDetails;

      if (!amount) {
        toast("Please enter valid amount");
        return;
      }

      if (Number(amount) < 10) {
        toast("Minimum deposit amount is 10");
        return;
      }

      if (paymentMethod === "bank") {
        const { accountNumber, ifscCode, bankName } = accountDetails;

        if (!accountNumber || !ifscCode || !bankName) {
          toast("Please fill all bank details");
          return;
        }

        if (accountNumber.length < 10) {
          toast("Account number must be at least 10 digits");
          return;
        }
      }

      if (paymentMethod === "upi") {
        if (!accountDetails.upi) {
          toast("Please enter UPI ID");
          return;
        }
      }

      setLoading(true);

      const payload = {
        method: paymentMethod,
        ...accountDetails,
      };

      const response = await AuthService.DepositWallet(payload);

      if (response?.data?.success) {
        toast("Deposit request submitted successfully");

        setAccountDetails({
          amount: "",
          accountHolder: "",
          accountNumber: "",
          ifscCode: "",
          bankName: "",
          upi: "",
        });


        fetchHistory();
      } else {
        toast(response?.data?.message || "Deposit failed");
      }
    } catch (error) {
      toast(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasePage
      title="Deposit Wallet"
      subtitle="Manage your deposit wallet"
      icon={<FaWallet />}
    >
      <div className="wallet-content">
        <h1>Start Your Passive Income Today</h1>
      </div>

      <div className="form-group">
        <label>Payment Method</label>
        <div className="payment-methods">
          <button
            className={paymentMethod === "bank" ? "active" : ""}
            onClick={() => setPaymentMethod("bank")}
          >
            <FaCreditCard /> Bank Transfer
          </button>

          <button
            className={paymentMethod === "upi" ? "active" : ""}
            onClick={() => setPaymentMethod("upi")}
          >
            <FaMobileAlt /> UPI
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>Amount</label>
        <input
          type="number"
          min="10"
          placeholder="Enter amount"
          value={accountDetails.amount}
          onChange={(e) =>
            setAccountDetails({
              ...accountDetails,
              amount: e.target.value,
            })
          }
        />
      </div>

      {paymentMethod === "bank" && (
        <div className="form-group">
          <h3>Bank Details</h3>

          <input
            type="text"
            placeholder="Account Holder Name"
            value={accountDetails.accountHolder}
            onChange={(e) =>
              setAccountDetails({
                ...accountDetails,
                accountHolder: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Account Number"
            value={accountDetails.accountNumber}
            onChange={(e) =>
              setAccountDetails({
                ...accountDetails,
                accountNumber: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="IFSC Code"
            value={accountDetails.ifscCode}
            onChange={(e) =>
              setAccountDetails({
                ...accountDetails,
                ifscCode: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Bank Name"
            value={accountDetails.bankName}
            onChange={(e) =>
              setAccountDetails({
                ...accountDetails,
                bankName: e.target.value,
              })
            }
          />
        </div>
      )}

      {paymentMethod === "upi" && (
        <div className="form-group">
          <label>UPI ID</label>
          <input
            type="text"
            placeholder="Enter UPI ID"
            value={accountDetails.upi}
            onChange={(e) =>
              setAccountDetails({
                ...accountDetails,
                upi: e.target.value,
              })
            }
          />
        </div>
      )}

      <button
        className="deposit-btn"
        onClick={handleDeposit}
        disabled={loading}
      >
        {loading
          ? "Processing..."
          : `Deposit ₹${accountDetails.amount || 0}`}
      </button>

      <div className="history-main">
        <h2>Deposit History</h2>

        <div className="history-table">
          <div className="history-content header">
            <span>Amount</span>
            <span>Method</span>
            <span>Status</span>
            <span>Date</span>
            <span>Transaction ID</span>
          </div>

          {history.length === 0 ? (
            <p>No history found</p>
          ) : (
            history.map((item, index) => (
              <div className="history-content" key={index}>
                <span>₹{item.amount}</span>
                <span>{item.method}</span>

                <span className={`status ${item.status}`}>
                  {item.status}
                </span>

                <span>
                  {item.date
                    ? new Date(item.date).toLocaleDateString()
                    : "-"}
                </span>

                <span>{item.transactionId || "-"}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </BasePage>
  );
};

export default DepositWallet;