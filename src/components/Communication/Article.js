import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaFileAlt } from 'react-icons/fa';

const Article = ({ user }) => {
  return (
    <BasePage 
      title="Articles" 
      subtitle="Read and manage articles"
      icon={<FaFileAlt />}
    >
      <div className="article-content">
        <p>Article management coming soon...</p>
      </div>
    </BasePage>
  );
};

export default Article;
