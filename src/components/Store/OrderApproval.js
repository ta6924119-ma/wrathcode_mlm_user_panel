import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaCheckCircle } from 'react-icons/fa';

const OrderApproval = ({ user }) => {
  return (
    <BasePage 
      title="Order Approval" 
      subtitle="Approve pending orders"
      icon={<FaCheckCircle />}
    >
      <div className="order-approval-content">
        <p>Order approval management coming soon...</p>
      </div>
    </BasePage>
  );
};

export default OrderApproval;
