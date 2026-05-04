import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaCreditCard } from 'react-icons/fa';

const FundCredit = ({ user }) => {
  return (
    <BasePage 
      title="Fund Credit" 
      subtitle="Credit funds to member accounts"
      icon={<FaCreditCard />}
    >
      <div className="fund-credit-content">
        <p>Fund credit management coming soon...</p>
      </div>
    </BasePage>
  );
};

export default FundCredit;
