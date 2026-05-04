import React from 'react';
import BasePage from '../Pages/BasePage';
import { FaBlog } from 'react-icons/fa';

const Blog = ({ user }) => {
  return (
    <BasePage 
      title="Blog" 
      subtitle="Read and manage blog posts"
      icon={<FaBlog />}
    >
      <div className="blog-content">
        <p>Blog management coming soon...</p>
      </div>
    </BasePage>
  );
};

export default Blog;
