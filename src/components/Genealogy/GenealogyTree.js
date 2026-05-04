import React from 'react';
import BasePage from '../Pages/BasePage';
import Downline from '../Downline/Downline';

const GenealogyTree = ({ user }) => {
  return (
    <BasePage 
      title="Genealogy Tree" 
      subtitle="Visual representation of your network"
    >
      <Downline user={user} />
    </BasePage>
  );
};

export default GenealogyTree;

//downline component me tree structure h 
//jisme left or right , or mamber ka data yee sab render  ho rha h 