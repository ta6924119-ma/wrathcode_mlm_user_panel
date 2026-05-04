import React from 'react';
import './BasePage.css';

const BasePage = ({ title, subtitle, children, icon }) => {
  return (
    <div className="base-page">
      <div className="page-header">
        <div className="header-content">
          {icon && <div className="header-icon">{icon}</div>}
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="page-content">
        {children}
      </div>
    </div>
  );
};

export default BasePage;
