import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaBox } from 'react-icons/fa';

const HoldingTank = ({ user }) => {
  return (
    <BasePage 
      title="Holding Tank" 
      subtitle="Manage pending members"
      icon={<FaBox />}
    >
      <div className="holding-tank-content">
        <p>Holding tank management coming soon...</p>
      </div>
    </BasePage>
  );
};

export default HoldingTank;
