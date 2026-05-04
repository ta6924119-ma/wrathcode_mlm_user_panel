import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaVideo } from 'react-icons/fa';

const Videos = ({ user }) => {
  return (
    <BasePage 
      title="Videos" 
      subtitle="Manage training videos"
      icon={<FaVideo />}
    >
      <div className="videos-content">
        <p>Video management coming soon...</p>
      </div>
    </BasePage>
  );
};

export default Videos;
