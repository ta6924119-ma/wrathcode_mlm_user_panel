import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaFileAlt } from 'react-icons/fa';

const Documents = ({ user }) => {
  return (
    <BasePage 
      title="Documents" 
      subtitle="Manage documents and files"
      icon={<FaFileAlt />}
    >
      <div className="documents-content">
        <p>Document management coming soon...</p>
      </div>
    </BasePage>
  );
};

export default Documents;
