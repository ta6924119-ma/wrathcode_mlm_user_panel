import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaShoppingCart } from 'react-icons/fa';

const Sales = ({ user }) => {
  return (
    <BasePage 
      title="Sales" 
      subtitle="View sales statistics and analytics"
      icon={<FaShoppingCart />}
    >
      <div className="sales-content">
        <p>Sales dashboard coming soon...</p>
      </div>
    </BasePage>
  );
};

export default Sales;
