import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaQuestionCircle } from 'react-icons/fa';

const FAQs = ({ user }) => {
  return (
    <BasePage 
      title="FAQs" 
      subtitle="Frequently Asked Questions"
      icon={<FaQuestionCircle />}
    >
      <div className="faqs-content">
        <p>FAQs coming soon...</p>
      </div>
    </BasePage>
  );
};

export default FAQs;
