import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaTrophy } from 'react-icons/fa';

const TopEarners = ({ user }) => {
  return (
    <BasePage 
      title="Top Earners" 
      subtitle="View top performing members"
      icon={<FaTrophy />}
    >
      <div className="top-earners-content">
        <p>Top earners list coming soon...</p>
      </div>
    </BasePage>
  );
};

export default TopEarners;
