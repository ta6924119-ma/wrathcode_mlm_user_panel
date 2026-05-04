import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaCalendarAlt } from 'react-icons/fa';

const Events = ({ user }) => {
  return (
    <BasePage 
      title="Events" 
      subtitle="Manage events and promotions"
      icon={<FaCalendarAlt />}
    >
      <div className="events-content">
        <p>Event management coming soon...</p>
      </div>
    </BasePage>
  );
};

export default Events;
