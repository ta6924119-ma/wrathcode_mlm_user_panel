import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateUser } from '../../store/slices/authSlice';
import AuthService from '../../Apis/AuthService/AuthService';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaGlobe, FaCalendarAlt, FaEdit, FaSave, FaTimes, FaTrophy, FaUsers, FaDollarSign, FaCopy, FaAward, FaChartLine, FaStar, FaShieldAlt, FaCheckCircle, FaCrown, FaMedal, FaCamera } from 'react-icons/fa';
import './Profile.css';

const Profile = ({ user, setUser }) => {
  const dispatch = useAppDispatch();
  // const { totalEarnings } = useAppSelector((state) => state.commission);
  // const { members } = useAppSelector((state) => state.downline);


  const [isEditing, setIsEditing] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);


  const [verificationStatus, setVerificationStatus] = useState('pending');

  useEffect(() => {
    if (user?.kycStatus) {
      setVerificationStatus(user.kycStatus.toLowerCase());
    }
  }, [user]);



  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await AuthService.getProfile();
        console.log("api profile response", response)

        if (response.success) {
          const profileData = {

            ...response.accountInfo,
            ...response.statistics,
            ...response.profile,
          };

          console.log("API merged:", profileData); // ✅ YAHAN

          dispatch(updateUser(profileData));
          console.log("FINAL USER AFTER DISPATCH:", profileData.kycStatus);

          setFormData({
            name: profileData?.name || '',
            email: profileData?.email || '',
            phone: profileData?.phone || '',
            address: profileData?.address || '',
            city: profileData?.city || '',
            country: profileData?.country || '',
            profileImage: null
          });

          if (profileData?.profileImage) {
            setProfileImage(profileData.profileImage);
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfileData();
  }, [dispatch]);

  // Helper to get display name from any data object
  const getDisplayNameFromData = (userData) => {
    if (userData?.name && userData.name.toLowerCase() !== 'admin') {
      return userData.name;
    }
    return userData?.username || '';
  };

  // Helper to get display name (use username if name is "admin")
  const getDisplayName = () => {
    return getDisplayNameFromData(user);
  };

  const [formData, setFormData] = useState({
    name: getDisplayName(),
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    profileImage: null
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Optional: Show that field has been changed
    setMessage({ type: 'info', text: 'Changes detected. Click Save to update.' });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     setSubmitLoading(true);

  //     const res = await AuthService.updateProfile(formData);

  //     if (res.success) {
  //       // Update Redux store and localStorage
  //       dispatch(updateUser(formData));
  //       setIsEditing(false);
  //       setMessage('Profile updated successfully!');
  //       setTimeout(() => setMessage(), 3000);
  //     } else {
  //       setMessage('Failed to update profile. Please try again.' );
  //     }
  //   } catch (error) {
  //     setMessage( 'Failed to update profile. Please try again.' );
  //   } finally {
  //     setSubmitLoading(false);
  //   }
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitLoading(true);

      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        const value = formData[key];

        if (value && value.type) {
          // file
          formDataToSend.append(key, value);
        } else {
          formDataToSend.append(key, value ?? "");
        }
      });

      const res = await AuthService.updateProfile(formDataToSend);

      if (res.success) {
        dispatch(updateUser(res.user));
        setIsEditing(false);

        // update UI image from backend
        if (res.user?.profileImage) {
          setProfileImage(res.user.profileImage);
        }

        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setSubmitLoading(false);
    }
  };
  const handleCancel = () => {
    setFormData({
      name: getDisplayName(),
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      country: user?.country || ''
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);

      // store file in formData
      setFormData((prev) => {
        const updatedFormData = {
          ...prev,
          profileImage: file
        };

        // Auto-save after image selection
        setTimeout(() => {
          handleImageSubmit(updatedFormData);
        }, 500);

        return updatedFormData;
      });
    }
  };

  // Auto-submit handler for image changes
  const handleImageSubmit = async (dataToSubmit) => {
    try {
      setSubmitLoading(true);

      const formDataToSend = new FormData();

      Object.keys(dataToSubmit).forEach((key) => {
        const value = dataToSubmit[key];

        if (value && value.type) {
          // file
          formDataToSend.append(key, value);
        } else {
          formDataToSend.append(key, value ?? "");
        }
      });

      const res = await AuthService.updateProfile(formDataToSend);

      if (res.success) {
        dispatch(updateUser(res.user));

        if (res.user?.profileImage) {
          setProfileImage(res.user.profileImage);
        }

        setMessage({ type: 'success', text: 'Profile image updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile image' });
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setMessage({ type: 'error', text: 'Something went wrong while uploading image' });
    } finally {
      setSubmitLoading(false);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  // const copyReferralCode = async () => {
  //   try {
  //     const code = user?.referralCode || `REF${user?.id || '000000'}`;
  //     await navigator.clipboard.writeText(code);
  //     setMessage({ type: 'success', text: 'Referral code copied!' });
  //     setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  //   } catch (err) {
  //     console.error('Failed to copy:', err);
  //     // Fallback for older browsers
  //     const code = user?.referralCode || `REF${user?.id || '000000'}`;
  //     const textArea = document.createElement('textarea');
  //     textArea.value = code;
  //     document.body.appendChild(textArea);
  //     textArea.select();
  //     document.execCommand('copy');
  //     document.body.removeChild(textArea);
  //     setMessage({ type: 'success', text: 'Referral code copied!' });
  //     setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  //   }
  // };



  // Calculate additional stats

  // ✅ Backend stats (ADD HERE)
  // const totalReferrals = user?.totalReferrals || 0;
  // const totalEarnings = user?.totalEarning || 0;
  // const referralCode = user?.referralCode || "N/A";
  // const completionPercentage = user?.profileCompletion || 0;


  // // Calculate profile completion dynamically based on filled fields
  // const profileFields = [user?.name, user?.email, user?.phone, user?.address, user?.city, user?.country, user?.profileImage];
  // const filledFields = profileFields.filter(field => field && field.toString().trim() !== '').length;
  // // const completionPercentage = Math.round((filledFields / profileFields.length) * 100);




  const totalReferrals = user?.totalReferrals || 0;
  const totalEarnings = user?.totalEarning || 0;
  const referralCode = user?.referralCode || "N/A";
  const completionPercentage = user?.profileCompletion || 0;


  const memberLevel =
    totalReferrals >= 100 ? 'Diamond' :
      totalReferrals >= 50 ? 'Gold' :
        totalReferrals >= 20 ? 'Silver' : 'Bronze';

  const rank =
    totalReferrals >= 100 ? 'Top 1%' :
      totalReferrals >= 50 ? 'Top 5%' :
        totalReferrals >= 20 ? 'Top 10%' : 'Rising Star';


  return (
    <div className="profile-container">
      <div className="page-header">
        <div className="header-content">
          <h1>My Profile</h1>
          <p>Manage your account information and track your achievements</p>
        </div>
        <div className="header-badge">
          <FaCrown className="crown-icon" />
          <span>{memberLevel} Member</span>
        </div>
      </div>

      {message.text && (
        <div className={`profile-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-content">
        {/* Main Profile Card */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar" onClick={triggerImageUpload} style={{ cursor: 'pointer' }}>
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="avatar-image" />
                ) : (
                  <span className="avatar-text">{getDisplayName()?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}</span>
                )}
                <div className="avatar-ring"></div>
                <div className="avatar-change-overlay">
                  <FaCamera className="avatar-camera-icon" />
                  <span>Change</span>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <div className="avatar-status"></div>
            </div>
            <div className="profile-info">
              <div className="name-wrapper">
                <h2>{getDisplayName() || user?.username || 'User'}</h2>
                <span className="rank-badge">{rank}</span>
              </div>
              <p className="profile-email">{user?.email || 'No email'}</p>
              <div className="profile-badges">
                <span className="badge badge-active">
                  <FaCheckCircle /> Active Member
                </span>
                <span className={`badge ${verificationStatus === 'verified'
                  ? 'badge-verified'
                  : verificationStatus === 'pending'
                    ? 'badge-pending'
                    : 'badge-rejected'
                  }`}>
                  <FaShieldAlt />
                  {
                    verificationStatus === 'verified'
                      ? 'Verified'
                      : verificationStatus === 'pending'
                        ? 'Pending'
                        : 'Rejected'
                  }
                </span>
                <span className="badge badge-level">
                  <FaCrown /> {memberLevel}
                </span>
              </div>
              <div className="profile-stats-mini">
                <div className="mini-stat">
                  <FaUsers className="mini-icon" />
                  <span className="mini-value">{totalReferrals}</span>
                  <span className="mini-label">Referrals</span>
                </div>
                <div className="mini-stat">
                  <FaDollarSign className="mini-icon" />
                  <span className="mini-value">${totalEarnings.toFixed(0)}</span>
                  <span className="mini-label">Earnings</span>
                </div>
                <div className="mini-stat">
                  <FaChartLine className="mini-icon" />
                  <span className="mini-value">{completionPercentage}%</span>
                  <span className="mini-label">Complete</span>
                </div>
              </div>
            </div>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="edit-button">
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>

          <div className="profile-details">
            <h3 className="section-title">
              <span className="title-icon">📋</span>
              Account Information
            </h3>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <FaUser /> Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <FaEnvelope /> Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      <FaPhone /> Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <FaCity /> City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    <FaMapMarkerAlt /> Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <FaGlobe /> Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter your country"
                  />
                </div>
                <div className="form-actions">

                  {/* edit btn save changes */}
                  <button type="submit" className="save-button" disabled={submitLoading}>
                    <FaSave /> {submitLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={handleCancel} className="cancel-button" disabled={submitLoading}>
                    <FaTimes /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="account-info-table">
                <div className="table-header">
                  <div className="table-cell">Information</div>
                  <div className="table-cell">Details</div>
                </div>
                <div className="table-row">
                  <div className="field-cell">
                    <FaUser className="field-icon" />
                    <span>Full Name</span>
                    <span className="field-value">{getDisplayName() || user?.username || 'Not set'}</span>
                  </div>
                </div>
                <div className="table-row">
                  <div className="field-cell">
                    <FaEnvelope className="field-icon" />
                    <span>Email</span>
                    <span className="field-value">{user?.email || 'Not set'}</span>
                  </div>
                </div>
                <div className="table-row">
                  <div className="field-cell">
                    <FaPhone className="field-icon" />
                    <span>Phone</span>
                    <span className="field-value">{user?.phone || 'Not set'}</span>
                  </div>
                </div>
                <div className="table-row">
                  <div className="field-cell">
                    <FaMapMarkerAlt className="field-icon" />
                    <span>Address</span>
                    <span className="field-value">{user?.address || 'Not set'}</span>
                  </div>
                </div>
                <div className="table-row">
                  <div className="field-cell">
                    <FaCity className="field-icon" />
                    <span>City</span>
                    <span className="field-value">{user?.city || 'Not set'}</span>
                  </div>
                </div>
                <div className="table-row">
                  <div className="field-cell">
                    <FaGlobe className="field-icon" />
                    <span>Country</span>
                    <span className="field-value">{user?.country || 'Not set'}</span>
                  </div>
                </div>
                <div className="table-row">
                  <div className="field-cell">
                    <FaCalendarAlt className="field-icon" />
                    <span>Member Since</span>
                    <span className="field-value">
                      {user?.joinDate ? new Date(user.joinDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="profile-sidebar">
          <div className="sidebar-card stats-card">
            <div className="card-header-gradient"></div>
            <h3 className="sidebar-title">
              <FaTrophy className="title-icon-main" /> Account Statistics
            </h3>
            <div className="stats-list">
              <div className="stat-item stat-item-featured">
                <div className="stat-icon-wrapper stat-icon-primary">
                  <FaCopy className="stat-icon" />
                </div>
                <div className="stat-content">
                  <span className="stat-label">Referral Code</span>
                  <div className="stat-value-wrapper">
                    <span className="stat-value code">{referralCode}</span>
                    {/* <button onClick={copyReferralCode} className="copy-btn" title="Copy">
                      <FaCopy />
                    </button> */}
                  </div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon-wrapper stat-icon-success">
                  <FaUsers className="stat-icon" />
                </div>
                <div className="stat-content">
                  <span className="stat-label">Total Referrals</span>
                  <span className="stat-value">{totalReferrals}</span>
                  <div className="stat-progress">
                    <div className="progress-bar" style={{ width: `${Math.min((totalReferrals / 100) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon-wrapper stat-icon-warning">
                  <FaDollarSign className="stat-icon" />
                </div>
                <div className="stat-content">
                  <span className="stat-label">Total Earnings</span>
                  <span className="stat-value">${totalEarnings.toFixed(2)}</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon-wrapper stat-icon-info">
                  <FaChartLine className="stat-icon" />
                </div>
                <div className="stat-content">
                  <span className="stat-label">Profile Completion</span>
                  <div className="completion-wrapper">
                    <span className="stat-value">{completionPercentage}%</span>
                    <div className="completion-bar">
                      <div className="completion-fill" style={{ width: `${completionPercentage}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-card achievements-card">
            <div className="card-header-gradient"></div>
            <h3 className="sidebar-title">
              <FaAward className="title-icon-main" /> Achievements
            </h3>
            <div className="achievements-grid">
              <div className="achievement-item unlocked">
                <FaMedal className="achievement-icon" />
                <span className="achievement-name">First Referral</span>
              </div>
              <div className="achievement-item unlocked">
                <FaTrophy className="achievement-icon" />
                <span className="achievement-name">10 Referrals</span>
              </div>
              <div className={`achievement-item ${totalReferrals >= 50 ? 'unlocked' : 'locked'}`}>
                <FaCrown className="achievement-icon" />
                <span className="achievement-name">50 Referrals</span>
              </div>
              <div className={`achievement-item ${totalReferrals >= 100 ? 'unlocked' : 'locked'}`}>
                <FaStar className="achievement-icon" />
                <span className="achievement-name">100 Referrals</span>
              </div>
            </div>
          </div>

          <div className="sidebar-card quick-actions">
            <div className="card-header-gradient"></div>
            <h3 className="sidebar-title">
              <span className="title-icon-main">⚡</span> Quick Actions
            </h3>
            <div className="actions-list">
              <button className="action-btn action-primary">
                <FaTrophy className="action-icon" />
                <div className="action-content">
                  <span className="action-title">View Achievements</span>
                  <span className="action-subtitle">See all your badges</span>
                </div>
                <span className="action-arrow">→</span>
              </button>
              <button className="action-btn action-success">
                <FaUsers className="action-icon" />
                <div className="action-content">
                  <span className="action-title">Invite Friends</span>
                  <span className="action-subtitle">Share your referral code</span>
                </div>
                <span className="action-arrow">→</span>
              </button>
              <button className="action-btn action-warning">
                <FaDollarSign className="action-icon" />
                <div className="action-content">
                  <span className="action-title">Withdraw Earnings</span>
                  <span className="action-subtitle">Transfer to your wallet</span>
                </div>
                <span className="action-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Profile;
