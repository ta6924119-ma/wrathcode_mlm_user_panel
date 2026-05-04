import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { loginSuccess } from '../../store/slices/authSlice';
import { FaGoogle } from 'react-icons/fa';
import AuthService from '../../Apis/AuthService/AuthService';
import './Auth.css';
import { FaRegEyeSlash, FaEye } from "react-icons/fa";


const Login = ({ onLogin }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(true);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleUseDemoCredentials = (email, password) => {
    setFormData({
      ...formData,
      email,
      password
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await AuthService.login({
        email: formData.email,
        password: formData.password
      });

      console.log("LOGIN RESPONSE ", response);

      const isSuccess = response?.success === true;
      if (!isSuccess) {
        setError(response?.message || response?.error || 'Invalid credentials');
        return;
      }

      const user = response?.admin || response?.user || {};
      const token = user?.token || response?.token;

      let finalUser = { ...user };

      if (token) {
        localStorage.setItem('token', token);

        try {
          const profileResponse = await AuthService.getProfile();
          if (profileResponse?.success) {
            finalUser = {
              ...finalUser,
              ...profileResponse.accountInfo,
              ...profileResponse.statistics,
              ...profileResponse.profile,
            };
          }
        } catch (err) {
          console.log("Failed to fetch profile on login", err);
        }
      }

      localStorage.setItem('user', JSON.stringify(finalUser));

      dispatch(loginSuccess(finalUser));

      if (onLogin) onLogin(finalUser);

      navigate('/dashboard');

    } catch (error) {
      console.log("ERROR ", error);

      setError(
        error?.response?.data?.message ||
        error?.message ||
        'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your MLM account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showDemoCredentials && (
          <div className="demo-credentials">
            <div className="demo-alert">
              <span className="demo-icon">👤</span>
              <div className="demo-content">
                <span>Admin email: admin@cloudmlmdemo.com password: 12345678</span>
                <button
                  type="button"
                  className="demo-use-btn"
                  onClick={() => handleUseDemoCredentials('admin@cloudmlmdemo.com', '12345678')}
                >
                  USE
                </button>
              </div>
            </div>
            <div className="demo-alert">
              <span className="demo-icon">👤</span>
              <div className="demo-content">
                <span>User email: clouduser@cloudmlmdemo.com password: 12345678</span>
                <button
                  type="button"
                  className="demo-use-btn"
                  onClick={() => handleUseDemoCredentials('clouduser@cloudmlmdemo.com', '12345678')}
                >
                  USE
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaRegEyeSlash /> : <FaEye />}
            </span>

          </div>

          {/* <div className="form-group">
            <label htmlFor="plan">Choose Plan</label>
            <select
              id="plan"
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              className="plan-select"
            >
              <option value="Binary">Binary</option>
              <option value="Uni Level">Uni Level</option>
              <option value="Matrix">Matrix</option>
              <option value="Roi">ROI</option>
              <option value="Mono Line">Mono Line</option>
            </select>
          </div> */}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>



        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;



