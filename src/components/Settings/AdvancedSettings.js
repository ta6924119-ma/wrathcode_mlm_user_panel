import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaCog } from 'react-icons/fa';

const AdvancedSettings = ({ user }) => {
  return (
    <BasePage 
      title="Advanced Settings" 
      subtitle="Configure advanced system settings"
      icon={<FaCog />}
    >
      <div className="advanced-settings-content">
        <p>Advanced settings coming soon...</p>
      </div>
    </BasePage>
  );
};

export default AdvancedSettings;
