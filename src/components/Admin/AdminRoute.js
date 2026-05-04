import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

/**
 * AdminRoute Component
 * Protects admin-only routes from unauthorized access
 * 
 * Admin Check Logic:
 * - User must have role: 'admin' in user object
 * - OR user.isAdmin === true
 * - OR user.email === 'admin@wrathcode.com'
 * 
 * To make a user admin, add one of these to their user object:
 * 1. role: 'admin'
 * 2. isAdmin: true
 * 3. Use email: 'admin@wrathcode.com'
 */
const AdminRoute = ({ children }) => {
  const { user } = useAppSelector((state) => state.auth);
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true || user?.email === 'admin@wrathcode.com';
  
  if (!isAdmin) {
    return (
      <div style={{ 
        padding: '40px 20px', 
        textAlign: 'center',
        color: '#e2e8f0',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ 
          background: 'rgba(30, 41, 59, 0.95)',
          padding: '40px',
          borderRadius: '16px',
          maxWidth: '500px',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
        }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</h1>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#ffffff' }}>Access Denied</h2>
          <p style={{ fontSize: '16px', color: 'rgba(226, 232, 240, 0.8)', marginBottom: '24px' }}>
            This page is restricted to administrators only.
          </p>
          <p style={{ fontSize: '14px', color: 'rgba(226, 232, 240, 0.6)' }}>
            You need administrator privileges to access MLM Settings.
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              marginTop: '24px',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return children;
};

export default AdminRoute;
