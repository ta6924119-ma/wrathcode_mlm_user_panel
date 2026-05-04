import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaGift } from 'react-icons/fa';

const Packages = ({ user }) => {
  return (
    <BasePage 
      title="Packages" 
      subtitle="Manage product packages"
      icon={<FaGift />}
    >
      <div className="packages-content">
        <p>Package management coming soon...</p>
      </div>
    </BasePage>
  );
};

export default Packages;
