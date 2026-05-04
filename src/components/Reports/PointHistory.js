import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaHistory } from 'react-icons/fa';

const PointHistory = ({ user }) => {
  return (
    <BasePage
      title="Point History"
      subtitle="View point transaction history"
      icon={<FaHistory />}
    >
      <div className="point-history-content">
        <p>Point history report coming soon...</p>
      </div>
    </BasePage>
  );
};

export default PointHistory;
