import React, { useState } from 'react';
import { FaIdCard, FaCamera, FaCheckCircle, FaTimesCircle, FaUpload } from 'react-icons/fa';
import './KYCVerification.css';
import AuthService from '../../Apis/AuthService/AuthService';

const KYCVerification = ({ user, onVerificationComplete }) => {
  const [verificationData, setVerificationData] = useState({
    fullName: user?.name || '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phoneNumber: '',
    idType: 'Passport',
    idNumber: '',
    idFrontImage: null,
    idBackImage: null,
    selfieImage: null,
    proofOfAddress: null
  });

  const [verificationStatus, setVerificationStatus] = useState(user?.kycStatus || 'pending'); // pending, verified, rejected
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const totalSteps = 4; // Added preview step

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVerificationData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (e, fieldName) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "File size must be less than 5MB",
      }));
      return;
    }

    setVerificationData((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!verificationData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!verificationData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!verificationData.address.trim()) newErrors.address = 'Address is required';
      if (!verificationData.city.trim()) newErrors.city = 'City is required';
      if (!verificationData.country.trim()) newErrors.country = 'Country is required';
      if (!verificationData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    }

    if (step === 2) {
      if (!verificationData.idType) newErrors.idType = 'ID type is required';
      if (!verificationData.idNumber.trim()) newErrors.idNumber = 'ID number is required';
      if (!verificationData.idFrontImage) newErrors.idFrontImage = 'Front image is required';
      if (!verificationData.idBackImage) newErrors.idBackImage = 'Back image is required';
    }

    if (step === 3) {
      if (!verificationData.selfieImage) newErrors.selfieImage = 'Selfie is required';
      if (!verificationData.proofOfAddress) newErrors.proofOfAddress = 'Proof of address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setUploading(true);

    try {
      const response = await AuthService.submitKYC(verificationData);

      if (!response?.success) {
        alert(response?.message || "KYC submission failed");
        return;
      }

      setVerificationStatus("pending");
      console.log("KYC submitted successfully! Response:", response);

      if (onVerificationComplete) {
        onVerificationComplete({
          ...user,
          kycStatus: "pending",
        });
      }

      alert("KYC submitted successfully! Under review.");
    } catch (error) {
      console.log("KYC ERROR:", error);
      alert("Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = () => {
    switch (verificationStatus) {
      case 'verified':
        return (
          <div className="kyc-status-badge verified">
            <FaCheckCircle /> Verified
          </div>
        );
      case 'rejected':
        return (
          <div className="kyc-status-badge rejected">
            <FaTimesCircle /> Rejected
          </div>
        );
      default:
        return (
          <div className="kyc-status-badge pending">
            <FaIdCard /> Pending Review
          </div>
        );
    }
  };

  if (verificationStatus === 'verified') {
    return (
      <div className="kyc-verification">
        <div className="kyc-verified-message">
          <FaCheckCircle className="verified-icon" />
          <h2>KYC Verification Complete</h2>
          <p>Your identity has been verified successfully. You can now access all features.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="kyc-verification">
      <div className="kyc-header">
        <h1>KYC Verification</h1>
        <p>Complete your identity verification to access all features</p>
        {getStatusBadge()}
      </div>

      {/* Progress Steps */}
      <div className="kyc-progress">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
            <div className="step-number">{step}</div>
            <div className="step-label">
              {step === 1 && 'Personal Info'}
              {step === 2 && 'ID Documents'}
              {step === 3 && 'Additional Proof'}
              {step === 4 && 'Review & Submit'}
            </div>
          </div>
        ))}
      </div>

      <div className="kyc-form-container">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="kyc-step">
            <h2>Personal Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={verificationData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <span className="error-text">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={verificationData.dateOfBirth}
                  onChange={handleChange}
                />
                {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
              </div>

              <div className="form-group full-width">
                <label>Address *</label>
                <input
                  type="text"
                  name="address"
                  value={verificationData.address}
                  onChange={handleChange}
                  placeholder="Street address"
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={verificationData.city}
                  onChange={handleChange}
                  placeholder="City"
                />
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label>State/Province</label>
                <input
                  type="text"
                  name="state"
                  value={verificationData.state}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>

              <div className="form-group">
                <label>ZIP/Postal Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={verificationData.zipCode}
                  onChange={handleChange}
                  placeholder="ZIP Code"
                />
              </div>

              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={verificationData.country}
                  onChange={handleChange}
                  placeholder="Country"
                />
                {errors.country && <span className="error-text">{errors.country}</span>}
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={verificationData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                />
                {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: ID Documents */}
        {currentStep === 2 && (
          <div className="kyc-step">
            <h2>Identity Documents</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>ID Type *</label>
                <select
                  name="idType"
                  value={verificationData.idType}
                  onChange={handleChange}
                >
                  <option value="Passport">Passport</option>
                  <option value="Driver_License">Driving License</option>
                  <option value="Aadhaar">Aadhaar</option>
                  <option value="PAN">PAN</option>
                  <option value="VoterID">Voter ID</option>

                </select>
                {errors.idType && <span className="error-text">{errors.idType}</span>}
              </div>

              <div className="form-group">
                <label>ID Number *</label>
                <input
                  type="text"
                  name="idNumber"
                  value={verificationData.idNumber}
                  onChange={handleChange}
                  placeholder="Enter ID number"
                />
                {errors.idNumber && <span className="error-text">{errors.idNumber}</span>}
              </div>

              <div className="form-group full-width">
                <label>ID Front Image *</label>
                <div className="image-upload-box">
                  {verificationData.idFrontImage ? (
                    <div className="uploaded-image">
                      <img src={URL.createObjectURL(verificationData.idFrontImage)} />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => setVerificationData(prev => ({ ...prev, idFrontImage: null }))}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <FaCamera />
                      <span>Upload Front Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'idFrontImage')}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
                {errors.idFrontImage && <span className="error-text">{errors.idFrontImage}</span>}
              </div>

              <div className="form-group full-width">
                <label>ID Back Image *</label>
                <div className="image-upload-box">
                  {verificationData.idBackImage ? (
                    <div className="uploaded-image">
                      <img src={URL.createObjectURL(verificationData.idBackImage)} alt="preview" />                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => setVerificationData(prev => ({ ...prev, idBackImage: null }))}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <FaCamera />
                      <span>Upload Back Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'idBackImage')}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
                {errors.idBackImage && <span className="error-text">{errors.idBackImage}</span>}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Additional Proof */}
        {currentStep === 3 && (
          <div className="kyc-step">
            <h2>Additional Verification</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Selfie with ID *</label>
                <div className="image-upload-box">
                  {verificationData.selfieImage ? (
                    <div className="uploaded-image">
                      <img src={URL.createObjectURL(verificationData.selfieImage)} alt="preview" />                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => setVerificationData(prev => ({ ...prev, selfieImage: null }))}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <FaCamera />
                      <span>Upload Selfie with ID</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'selfieImage')}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
                {errors.selfieImage && <span className="error-text">{errors.selfieImage}</span>}
                <p className="help-text">Take a selfie holding your ID next to your face</p>
              </div>

              <div className="form-group full-width">
                <label>Proof of Address *</label>
                <div className="image-upload-box">
                  {verificationData.proofOfAddress ? (
                    <div className="uploaded-image">
                      <img src={URL.createObjectURL(verificationData.proofOfAddress)} />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => setVerificationData(prev => ({ ...prev, proofOfAddress: null }))}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="upload-label">
                      <FaUpload />
                      <span>Upload Proof of Address</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleImageUpload(e, 'proofOfAddress')}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
                {errors.proofOfAddress && <span className="error-text">{errors.proofOfAddress}</span>}
                <p className="help-text">Utility bill, bank statement, or government document (max 3 months old)</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Preview & Review */}
        {currentStep === 4 && (
          <div className="kyc-step">
            <h2>Review Your Information</h2>
            <p className="preview-subtitle">Please review all your information before submitting. Make sure all details are correct.</p>

            <div className="preview-container">
              {/* Personal Information Preview */}
              <div className="preview-section">
                <h3 className="preview-section-title">
                  <FaIdCard /> Personal Information
                </h3>
                <div className="preview-grid">
                  <div className="preview-item">
                    <span className="preview-label">Full Name</span>
                    <span className="preview-value">{verificationData.fullName || 'N/A'}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">Date of Birth</span>
                    <span className="preview-value">{verificationData.dateOfBirth || 'N/A'}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">Phone Number</span>
                    <span className="preview-value">{verificationData.phoneNumber || 'N/A'}</span>
                  </div>
                  <div className="preview-item full-width">
                    <span className="preview-label">Address</span>
                    <span className="preview-value">{verificationData.address || 'N/A'}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">City</span>
                    <span className="preview-value">{verificationData.city || 'N/A'}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">State/Province</span>
                    <span className="preview-value">{verificationData.state || 'N/A'}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">ZIP/Postal Code</span>
                    <span className="preview-value">{verificationData.zipCode || 'N/A'}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">Country</span>
                    <span className="preview-value">{verificationData.country || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* ID Documents Preview */}
              <div className="preview-section">
                <h3 className="preview-section-title">
                  <FaIdCard /> Identity Documents
                </h3>
                <div className="preview-grid">
                  <div className="preview-item">
                    <span className="preview-label">ID Type</span>
                    <span className="preview-value">{verificationData.idType ? verificationData.idType.replace('_', ' ').toUpperCase() : 'N/A'}</span>
                  </div>
                  <div className="preview-item">
                    <span className="preview-label">ID Number</span>
                    <span className="preview-value">{verificationData.idNumber || 'N/A'}</span>
                  </div>
                </div>
                <div className="preview-images-grid">
                  <div className="preview-image-item">
                    <span className="preview-label">ID Front Image</span>
                    {verificationData.idFrontImage ? (
                      <div className="preview-image-box">
                        <img src={URL.createObjectURL(verificationData.idFrontImage)} />
                      </div>
                    ) : (
                      <div className="preview-image-placeholder">No image uploaded</div>
                    )}
                  </div>
                  <div className="preview-image-item">
                    <span className="preview-label">ID Back Image</span>
                    {verificationData.idBackImage ? (
                      <div className="preview-image-box">
                        <img src={URL.createObjectURL(verificationData.idBackImage)} />
                      </div>
                    ) : (
                      <div className="preview-image-placeholder">No image uploaded</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Documents Preview */}
              <div className="preview-section">
                <h3 className="preview-section-title">
                  <FaCheckCircle /> Additional Verification
                </h3>
                <div className="preview-images-grid">
                  <div className="preview-image-item">
                    <span className="preview-label">Selfie with ID</span>
                    {verificationData.selfieImage ? (
                      <div className="preview-image-box">
                        <img src={URL.createObjectURL(verificationData.selfieImage)} />
                      </div>
                    ) : (
                      <div className="preview-image-placeholder">No image uploaded</div>
                    )}
                  </div>
                  <div className="preview-image-item">
                    <span className="preview-label">Proof of Address</span>
                    {verificationData.proofOfAddress ? (
                      <div className="preview-image-box">
                        <img src={URL.createObjectURL(verificationData.proofOfAddress)} />
                      </div>
                    ) : (
                      <div className="preview-image-placeholder">No document uploaded</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="kyc-navigation">
          {currentStep > 1 && (
            <button type="button" className="btn-secondary" onClick={handlePrevious}>
              Previous
            </button>
          )}
          <div className="spacer" />
          {currentStep < totalSteps ? (
            <button type="button" className="btn-primary" onClick={handleNext}>
              {currentStep === 3 ? 'Review & Submit' : 'Next Step'}
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={handleSubmit}
              disabled={uploading}
            >
              {uploading ? 'Submitting...' : 'Submit Verification'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;
