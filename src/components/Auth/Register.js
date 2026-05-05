import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';

import { loginSuccess } from '../../store/slices/authSlice';

import AuthService from "../../Apis/AuthService/AuthService";
import './Auth.css';
import { FaRegEyeSlash, FaEye } from "react-icons/fa";


const Register = ({ onLogin }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referral: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setLoading(true);

  //   try {
  //     // Validation
  //     if (formData.password !== formData.confirmPassword) {
  //       setError('Passwords do not match');
  //       setLoading(false);
  //       return;
  //     }

  //     if (formData.password.length < 6) {
  //       setError('Password must be at least 6 characters');
  //       setLoading(false);
  //       return;
  //     }

  //     // Simulate API call - replace with actual API
  //     await new Promise(resolve => setTimeout(resolve, 1000));

  //     // Generate referral code
  //     const referral = `REF${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

  //     // Mock registration - replace with actual API call
  //     const userData = {
  //       id: Date.now().toString(),
  //       name: formData.name,
  //       email: formData.email,
  //       username: formData.email.split('@')[0],
  //       password: formData.password, // In production, hash this
  //       joinDate: new Date().toISOString(),
  //       referral: referral,
  //       referredBy: formData.referral || null
  //     };

  //     // Save to localStorage
  //     const users = JSON.parse(localStorage.getItem('mlm_users') || '[]');
  //     users.push(userData);
  //     localStorage.setItem('mlm_users', JSON.stringify(users));

  //     // Login user
  //     const loginData = { ...userData };
  //     delete loginData.password; // Don't store password in state
  //     dispatch(loginSuccess(loginData));
  //     if (onLogin) onLogin(loginData);
  //     navigate('/dashboard');
  //   } catch (err) {
  //     setError('Registration failed. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      const response = await AuthService.register({

        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        referral: formData.referral
      });

      const isSuccess = response?.success !== false && response?.succ !== false;

      if (!isSuccess) {
        console.log("ERROR FULL:", response);   // 👈 debug
        alert(response?.error || response?.message || "Registration failed");                  // 👈 yaha change
        return;
      }

      const rawUser = response?.admin || response?.user || {};
      const token = rawUser?.token || response?.token;

      if (token) {
        localStorage.setItem("token", token);
      }

      // 🔥 FINAL FIX
      const normalizedUser = {
        ...rawUser,
        token: token,
        name: formData.name,
        email: formData.email,
      };

      dispatch(loginSuccess(normalizedUser));

      if (onLogin) onLogin(normalizedUser);

      navigate("/dashboard");

    } catch (error) {
      console.log("ERROR FULL:", error);
      console.log("ERROR DATA:", error?.response?.data);
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false)
    }

  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join our MLM network today</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

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
              placeholder="Create a password (min 6 characters)"
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaRegEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaRegEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="referral">Referral Code (Optional)</label>
            <input
              type="text"
              id="referral"
              name="referral"
              value={formData.referral}
              onChange={handleChange}
              placeholder="Enter referral code if you have one"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;





