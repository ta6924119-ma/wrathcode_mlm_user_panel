import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaBox } from 'react-icons/fa';

const Products = ({ user }) => {
  return (
    <BasePage 
      title="Products" 
      subtitle="Manage products in store"
      icon={<FaBox />}
    >
      <div className="products-content">
        <p>Product management coming soon...</p>
      </div>
    </BasePage>
  );
};

export default Products;
