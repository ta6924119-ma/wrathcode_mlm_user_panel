import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaEnvelope } from 'react-icons/fa';

const Emails = ({ user }) => {
  return (
    <BasePage 
      title="Emails" 
      subtitle="Manage email communications"
      icon={<FaEnvelope />}
    >
      <div className="emails-content">
        <p>Email management coming soon...</p>
      </div>
    </BasePage>
  );
};

export default Emails;
