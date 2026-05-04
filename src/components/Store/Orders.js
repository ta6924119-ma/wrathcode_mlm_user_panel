import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaShoppingCart } from 'react-icons/fa';

const Orders = ({ user }) => {
  return (
    <BasePage 
      title="Orders" 
      subtitle="View and manage all orders"
      icon={<FaShoppingCart />}
    >
      <div className="orders-content">
        <p>Order management coming soon...</p>
      </div>
    </BasePage>
  );
};

export default Orders;
