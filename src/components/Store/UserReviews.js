import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaStar } from 'react-icons/fa';

const UserReviews = ({ user }) => {
  return (
    <BasePage 
      title="User Reviews" 
      subtitle="View and manage product reviews"
      icon={<FaStar />}
    >
      <div className="user-reviews-content">
        <p>User reviews coming soon...</p>
      </div>
    </BasePage>
  );
};

export default UserReviews;
