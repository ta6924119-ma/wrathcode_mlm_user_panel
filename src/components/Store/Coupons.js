import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaTicketAlt } from 'react-icons/fa';

const Coupons = ({ user }) => {
  return (
    <BasePage 
      title="Coupons" 
      subtitle="Manage discount coupons"
      icon={<FaTicketAlt />}
    >
      <div className="coupons-content">
        <p>Coupon management coming soon...</p>
      </div>
    </BasePage>
  );
};

export default Coupons;
