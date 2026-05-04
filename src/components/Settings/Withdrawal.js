import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaHandHoldingUsd } from 'react-icons/fa';

const Withdrawal = ({ user }) => {
  return (
    <BasePage 
      title="Withdrawal Settings" 
      subtitle="Configure withdrawal rules and limits"
      icon={<FaHandHoldingUsd />}
    >
      <div className="withdrawal-content">
        <p>Withdrawal settings coming soon...</p>
      </div>
    </BasePage>
  );
};

export default Withdrawal;
