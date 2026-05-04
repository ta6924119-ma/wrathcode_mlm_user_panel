import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaEnvelopeOpenText } from 'react-icons/fa';

const EmailTemplate = ({ user }) => {
  return (
    <BasePage 
      title="Email Templates" 
      subtitle="Manage email templates"
      icon={<FaEnvelopeOpenText />}
    >
      <div className="email-template-content">
        <p>Email template management coming soon...</p>
      </div>
    </BasePage>
  );
};

export default EmailTemplate;
