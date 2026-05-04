import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaLifeRing } from 'react-icons/fa';

const HelpCenter = ({ user }) => {
  return (
    <BasePage 
      title="Help Center" 
      subtitle="Get help and support"
      icon={<FaLifeRing />}
    >
      <div className="help-center-content">
        <p>Help center coming soon...</p>
      </div>
    </BasePage>
  );
};

export default HelpCenter;
