import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaUserShield } from 'react-icons/fa';

const SubAdmins = ({ user }) => {
  return (
    <BasePage 
      title="Sub Admins" 
      subtitle="Manage sub administrators"
      icon={<FaUserShield />}
    >
      <div className="sub-admins-content">
        <p>Sub admins management coming soon...</p>
      </div>
    </BasePage>
  );
};

export default SubAdmins;
