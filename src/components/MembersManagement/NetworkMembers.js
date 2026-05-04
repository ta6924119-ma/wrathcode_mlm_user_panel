import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaUsers } from 'react-icons/fa';

const NetworkMembers = ({ user }) => {
  return (
    <BasePage 
      title="Network Members" 
      subtitle="View and manage all network members"
      icon={<FaUsers />}
    >
      <div className="network-members-content">
        <p>Network members list coming soon...</p>
      </div>
    </BasePage>
  );
};

export default NetworkMembers;
