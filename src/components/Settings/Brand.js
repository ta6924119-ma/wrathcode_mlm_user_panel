import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaPalette } from 'react-icons/fa';

const Brand = ({ user }) => {
  return (
    <BasePage 
      title="Brand Settings" 
      subtitle="Configure brand identity and appearance"
      icon={<FaPalette />}
    >
      <div className="brand-content">
        <p>Brand settings coming soon...</p>
      </div>
    </BasePage>
  );
};

export default Brand;
