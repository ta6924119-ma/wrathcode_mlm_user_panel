// import React, { useState } from 'react';
// import BasePage from '../Pages/BasePage';
// import { FaUserFriends, FaUsers, FaChartLine } from 'react-icons/fa';
// import './GenealogySponsor.css';


// const GenealogySponsor = ({ user }) => {
//   const [selectedLevel, setSelectedLevel] = useState('all');

//   const sponsorTree = {
//     id: 0,
//     level: 0,
//     name: user?.name || 'You',
//     volume: 15000,
//     members: 24,
//     children: [
//       {
//         id: 1,
//         level: 1,
//         name: 'John Smith',
//         volume: 8000,
//         members: 12,
//         children: [
//           { id: 4, level: 2, name: 'Alice Williams', volume: 3000, members: 5, children: [] },
//           { id: 5, level: 2, name: 'Bob Johnson', volume: 5000, members: 7, children: [] }
//         ]
//       },
//       {
//         id: 2,
//         level: 1,
//         name: 'Jane Doe',
//         volume: 7000,
//         members: 10,
//         children: [
//           { id: 6, level: 2, name: 'Charlie Brown', volume: 4000, members: 6, children: [] },
//           { id: 7, level: 2, name: 'Diana Prince', volume: 3000, members: 4, children: [] }
//         ]
//       },
//       {
//         id: 3,
//         level: 1,
//         name: 'Eve Adams',
//         volume: 2000,
//         members: 2,
//         children: [
//           { id: 8, level: 2, name: 'Frank Miller', volume: 4000, members: 6, children: [] },
//           { id: 9, level: 2, name: 'Grace Lee', volume: 3000, members: 4, children: [] }]
//       }
//     ]
//   };

//   const renderLevel = (members, level) => {
//     if (!members || members.length === 0) return null;

//     return (
//       <div className={`sponsor-level level-${level}`}>
//         <div className="level-header">
//           <h3>Level {level}</h3>
//           <span className="level-count">{members.length} members</span>
//         </div>
//         <div className="members-grid">
//           {members.map((member) => (
//             <div key={member.id} className="member-card">
//               <div className="member-name">{member.name}</div>
//               <div className="member-stats">
//                 <span><FaChartLine /> ${member.volume.toLocaleString()}</span>
//                 <span><FaUsers /> {member.members}</span>
//                 <p>Level :{member.level}</p>
//               </div>
//               {member.children && member.children.length > 0 && (
//                 <div className="has-children">↓ {member.children.length} downline</div>
//               )}
//             </div>
//           ))}
//         </div>
//         {members.some(m => m.children && m.children.length > 0) && (
//           <div className="next-level">
//             {renderLevel(members.flatMap(m => m.children || []), level + 1)}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <BasePage
//       title="Matrix Tree"
//       subtitle="View your matrix network structure"
//       icon={<FaUserFriends />}
//     >
//       <div className="genealogy-sponsor-content">
//         <div className="sponsor-stats">
//           <div className="stat-card">
//             <div className="stat-label">Total Network</div>
//             <div className="stat-value">{sponsorTree.members}</div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-label">Total Volume</div>
//             <div className="stat-value">${sponsorTree.volume.toLocaleString()}</div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-label">Direct Referrals</div>
//             <div className="stat-value">{sponsorTree.children.length}</div>
//           </div>

//         </div>

//         <div className="sponsor-tree-container">
//           <div className="root-member">
//             <div className="member-card root">
//               <div className="member-name">{sponsorTree.name}</div>
//               <div className="member-stats">
//                 <span><FaChartLine /> ${sponsorTree.volume.toLocaleString()}</span>
//                 <span><FaUsers /> {sponsorTree.members}</span>
//               </div>
//             </div>
//           </div>
//           {renderLevel(sponsorTree.children, 1)}
//         </div>
//       </div>
//     </BasePage>
//   );
// };

// export default GenealogySponsor;







// real code with api integration..................



import React, { useEffect, useState } from 'react';
import BasePage from '../Pages/BasePage';
import { FaUserFriends, FaUsers, FaChartLine } from 'react-icons/fa';
import './GenealogySponsor.css';
import AuthService from '../../Apis/AuthService/AuthService';

const GenealogySponsor = ({ user }) => {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSponsorTree();
  }, []);

  const fetchSponsorTree = async () => {
    try {
      setLoading(true);

      const res = await AuthService.getSponsorTree();
      console.log(res, "api== =response")


      if (!res?.success) {
        setError(res?.message || "Failed to load data");
        return;
      }

      setTreeData(res.data);

    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const renderLevel = (members, level) => {
    if (!Array.isArray(members) || members.length === 0) {
      return null;
    }
    return (
      <div className={`sponsor-level level-${level}`}>
        <div className="level-header">
          <h3>Level {level}</h3>
          <span>{members.length} members</span>
        </div>

        <div className="members-grid">
          {members.map((member) => (
            <div key={member.id} className="member-card">
              <div className="member-name">{member.name}</div>

              <div className="member-stats">
                <span><FaChartLine /> ${(member.volume || 0).toLocaleString()}</span>
                <span><FaUsers /> {member.members || 0}</span>
                <p>Level: {member.level}</p>
              </div>

              {member.children?.length > 0 && (
                <div className="has-children">
                  ↓ {member.children.length} downline
                </div>
              )}
            </div>
          ))}
        </div>

        {members.some(m => m.children?.length > 0) && (
          <div className="next-level">
            {renderLevel(
              members.flatMap(m => m.children || []),
              //Sab members ke children ko ek flat array me convert
              level + 1
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <BasePage
      title="Matrix Tree"
      subtitle="View your network"
      icon={<FaUserFriends />}
    >
      <div className="genealogy-sponsor-content">

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {treeData && (
          <>
            {/* 📊 STATS ALWAYS SHOW */}
            <div className="sponsor-stats">
              <div className="stat-card">
                <div className="stat-label">Total Network</div>
                <div className="stat-value">
                  {treeData?.members ?? 0}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Total Volume</div>
                <div className="stat-value">
                  ${(treeData?.volume ?? 0).toLocaleString()}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Direct Referrals</div>
                <div className="stat-value">
                  {treeData?.children?.length ?? 0}
                </div>
              </div>
            </div>

            {/* 🌳 TREE ONLY WHEN DATA AVAILABLE */}
            {treeData && (
              <div className="sponsor-tree-container">
                <div className="root-member">
                  <div className="member-card root">
                    <div className="member-name">{treeData.name}</div>

                    <div className="member-stats">
                      <span><FaChartLine /> ${(treeData.volume || 0).toLocaleString()}</span>
                      <span><FaUsers /> {treeData.members}</span>
                    </div>
                  </div>
                </div>

                {renderLevel(treeData.children, 1)}
              </div>
            )}
          </>
        )}
      </div>
    </BasePage>
  );
};

export default GenealogySponsor;