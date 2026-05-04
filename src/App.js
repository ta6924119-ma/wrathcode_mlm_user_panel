import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { checkAuth, logout } from './store/slices/authSlice';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Referrals from './components/Referrals/Referrals';
import Downline from './components/Downline/Downline';
import Investments from './components/Investments/Investments';
import Commissions from './components/Commissions/Commissions';
import Wallet from './components/Wallet/Wallet';
import Profile from './components/Profile/Profile';
import Notifications from './components/Notifications/Notifications';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import TopHeader from './components/Layout/TopHeader';
import Landing from './components/Landing/Landing';
import MLMDashboard from './components/MLM/MLMDashboard';
import TeamPerformance from './components/MLM/TeamPerformance';
import RewardsBonuses from './components/MLM/RewardsBonuses';
import AdvancedReports from './components/MLM/AdvancedReports';
import RankAdvancement from './components/MLM/RankAdvancement';
import SupportTickets from './components/Support/SupportTickets';
import Announcements from './components/Announcements/Announcements';
import EnhancedWallet from './components/Wallet/EnhancedWallet';
import KYCVerification from './components/KYC/KYCVerification';
// Genealogy
import GenealogyBinary from './components/Genealogy/GenealogyBinary';
import GenealogySponsor from './components/Genealogy/GenealogySponsor';
import GenealogyTree from './components/Genealogy/GenealogyTree';
import GenealogyList from './components/Genealogy/GenealogyList';
// Financial - Only Payout for Withdraw
import Payout from './components/Financial/Payout';
// Reports
import FundTransfer from './components/Reports/FundTransfer';
import JoiningReport from './components/Reports/JoiningReport';
import MemberIncome from './components/Reports/MemberIncome';
import PayoutReport from './components/Reports/PayoutReport';
import TaxReport from './components/Reports/TaxReport';

import DepositWallet from './components/Financial/DepositWallet';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css';

/**
 * Page Transition Wrapper Component
 * Adds smooth page transitions
 */
const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <div
      key={location.pathname}
      className="page-enter-active"
      style={{
        animation: 'fadeIn 0.4s ease-out, slideUp 0.4s ease-out'
      }}
    >
      {children}
    </div>
  );
};

/**
 * Main App Component
 * Handles routing, authentication, and global state
 */
function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    /**
     * Check if user is logged in on app load
     */
    dispatch(checkAuth());
  }, [dispatch]);

  /**
   * Handle user login
   * @param {Object} userData - User data object
   */
  const handleLogin = (userData) => {
    // This will be handled by Redux in the Login component
    // But we keep it for backward compatibility
  };

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    dispatch(logout());
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="App">
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
            <p style={{ color: 'white', fontSize: '18px', fontWeight: 500 }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />


      <div className="App">
        {isAuthenticated && <Sidebar user={user} onLogout={handleLogout} />}
        {isAuthenticated && <TopHeader user={user} />}
        <div className={isAuthenticated ? "app-with-sidebar" : ""}>
          <Routes>
            <Route
              path="/login"
              element={
                <PageTransition>
                  {isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
                </PageTransition>
              }
            />
            <Route
              path="/register"
              element={
                <PageTransition>
                  {isAuthenticated ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />}
                </PageTransition>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PageTransition>
                  {isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/login" />}
                </PageTransition>
              }
            />
            <Route
              path="/referrals"
              element={
                <PageTransition>
                  {isAuthenticated ? <Referrals user={user} /> : <Navigate to="/login" />}
                </PageTransition>
              }
            />

            <Route
              path="/financial/depositWallet"
              element={
                <PageTransition>
                  {isAuthenticated ? <DepositWallet user={user} /> : <Navigate to="/login" />}
                </PageTransition>
              }
            />
            <Route
              path="/downline"
              element={
                <PageTransition>
                  {isAuthenticated ? <Downline user={user} /> : <Navigate to="/login" />}
                </PageTransition>
              }
            />
            <Route
              path="/investments"
              element={
                <PageTransition>
                  {isAuthenticated ? <Investments user={user} /> : <Navigate to="/login" />}
                </PageTransition>
              }
            />
            <Route
              path="/commissions"
              element={
                <PageTransition>
                  {isAuthenticated ? <Commissions user={user} /> : <Navigate to="/login" />}
                </PageTransition>
              }
            />
            <Route
              path="/wallet"
              element={
                <PageTransition>
                  {isAuthenticated ? <Wallet user={user} /> : <Navigate to="/login" />}
                </PageTransition>
              }
            />
            <Route
              path="/profile"
              element={
                <PageTransition>
                  {isAuthenticated ? <Profile user={user} setUser={handleLogin} /> : <Navigate to="/login" />}
                </PageTransition>
              }
            />
            <Route
              path="/notifications"
              element={
                <PageTransition>
                  {isAuthenticated ? <Notifications user={user} /> : <Navigate to="/login" />}
                </PageTransition>
              }
            />
            <Route
              path="/mlm-dashboard"
              element={
                <PageTransition>
                  {isAuthenticated ? <MLMDashboard user={user} /> : <Navigate to="/login" />}
                </PageTransition>
              }
            />
            <Route
              path="/team-performance"
              element={
                <PageTransition>
                  {isAuthenticated ? <TeamPerformance user={user} /> : <Navigate to="/login" />}
                </PageTransition>
              }
            />
            <Route
              path="/rewards-bonuses"
              element={
                <PageTransition>
                  {isAuthenticated ? <RewardsBonuses user={user} /> : <Navigate to="/login" />}
                </PageTransition>
              }
            />
            <Route
              path="/advanced-reports"
              element={
                <PageTransition>
                  {isAuthenticated ? <AdvancedReports user={user} /> : <Navigate to="/login" />}
                </PageTransition>
              }
            />
            <Route
              path="/rank-advancement"
              element={
                <PageTransition>
                  {isAuthenticated ? <RankAdvancement user={user} /> : <Navigate to="/login" />}
                </PageTransition>
              }
            />
            <Route
              path="/support"
              element={
                <PageTransition>
                  {isAuthenticated ? <SupportTickets user={user} /> : <Navigate to="/login" />}
                </PageTransition>
              }
            />
            <Route
              path="/announcements"
              element={
                <PageTransition>
                  {isAuthenticated ? <Announcements user={user} /> : <Navigate to="/login" />}
                </PageTransition>
              }
            />
            <Route
              path="/enhanced-wallet"
              element={
                <PageTransition>
                  {isAuthenticated ? <EnhancedWallet user={user} /> : <Navigate to="/login" />}
                </PageTransition>
              }
            />
            <Route
              path="/kyc"
              element={
                <PageTransition>
                  {isAuthenticated ? <KYCVerification user={user} /> : <Navigate to="/login" />}
                </PageTransition>
              }
            />
            {/* Genealogy Routes */}
            <Route path="/genealogy/binary" element={<PageTransition>{isAuthenticated ? <GenealogyBinary user={user} /> : <Navigate to="/login" />}</PageTransition>} />
            <Route path="/genealogy/sponsor" element={<PageTransition>{isAuthenticated ? <GenealogySponsor user={user} /> : <Navigate to="/login" />}</PageTransition>} />
            <Route path="/genealogy/tree" element={<PageTransition>{isAuthenticated ? <GenealogyTree user={user} /> : <Navigate to="/login" />}</PageTransition>} />
            <Route path="/genealogy/list" element={<PageTransition>{isAuthenticated ? <GenealogyList user={user} /> : <Navigate to="/login" />}</PageTransition>} />
            <Route path="/genealogy" element={<PageTransition>{isAuthenticated ? <Navigate to="/genealogy/tree" /> : <Navigate to="/login" />}</PageTransition>} />
            {/* Withdraw / Payout Route */}
            <Route path="/financial/payout" element={<PageTransition>{isAuthenticated ? <Payout user={user} /> : <Navigate to="/login" />}</PageTransition>} />
            {/* Reports Routes */}
            <Route path="/reports/member-income" element={<PageTransition>{isAuthenticated ? <MemberIncome user={user} /> : <Navigate to="/login" />}</PageTransition>} />
            <Route path="/reports/joining-report" element={<PageTransition>{isAuthenticated ? <JoiningReport user={user} /> : <Navigate to="/login" />}</PageTransition>} />
            <Route path="/reports/fund-transfer" element={<PageTransition>{isAuthenticated ? <FundTransfer user={user} /> : <Navigate to="/login" />}</PageTransition>} />
            <Route path="/reports/payout" element={<PageTransition>{isAuthenticated ? <PayoutReport user={user} /> : <Navigate to="/login" />}</PageTransition>} />

            <Route path="/reports/TaxReport" element={<PageTransition>{isAuthenticated ? <TaxReport user={user} /> : <Navigate to="/login" />}</PageTransition>} />

            <Route path="/reports" element={<PageTransition>{isAuthenticated ? <Navigate to="/reports/member-income" /> : <Navigate to="/login" />}</PageTransition>} />
            <Route
              path="/"
              element={
                <PageTransition>
                  {isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />}
                </PageTransition>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
