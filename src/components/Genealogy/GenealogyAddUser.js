import React, { useState } from 'react';
import BasePage from '../Pages/BasePage';
import { FaUserPlus } from 'react-icons/fa';
import './GenealogyAddUser.css';

const GenealogyAddUser = ({ user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sponsorId: '',
    position: 'left'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add user logic here
    alert('User added successfully!');
  };

  return (
    <BasePage 
      title="Add User" 
      subtitle="Add a new member to your network"
      icon={<FaUserPlus />}
    >
      <form className="add-user-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter full name"
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter email address"
          />
        </div>

        <div className="form-group">
          <label>Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter phone number"
          />
        </div>

        <div className="form-group">
          <label>Sponsor ID</label>
          <input
            type="text"
            name="sponsorId"
            value={formData.sponsorId}
            onChange={handleChange}
            placeholder="Enter sponsor ID (optional)"
          />
        </div>

        <div className="form-group">
          <label>Position *</label>
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          >
            <option value="left">Left Leg</option>
            <option value="right">Right Leg</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          Add User
        </button>
      </form>
    </BasePage>
  );
};

export default GenealogyAddUser;
