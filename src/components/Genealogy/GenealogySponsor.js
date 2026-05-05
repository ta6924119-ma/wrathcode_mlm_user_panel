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



// import React, { useEffect, useState } from 'react';
// import BasePage from '../Pages/BasePage';
// import { FaUserFriends, FaUsers, FaChartLine } from 'react-icons/fa';
// import './GenealogySponsor.css';
// import AuthService from '../../Apis/AuthService/AuthService';

// const GenealogySponsor = ({ user }) => {
//   const [treeData, setTreeData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchSponsorTree();
//   }, []);

//   const fetchSponsorTree = async () => {
//     try {
//       setLoading(true);

//       const res = await AuthService.getSponsorTree();
//       console.log(res, "api== =response")


//       if (!res?.success) {
//         setError(res?.message || "Failed to load data");
//         return;
//       }

//       setTreeData(res.data);

//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderLevel = (members, level) => {
//     if (!Array.isArray(members) || members.length === 0) {
//       return null;
//     }
//     return (
//       <div className={`sponsor-level level-${level}`}>
//         <div className="level-header">
//           <h3>Level {level}</h3>
//           <span>{members.length} members</span>
//         </div>

//         <div className="members-grid">
//           {members.map((member) => (
//             <div key={member.id} className="member-card">
//               <div className="member-name">{member.name}</div>

//               <div className="member-stats">
//                 <span><FaChartLine /> ${(member.volume || 0).toLocaleString()}</span>
//                 <span><FaUsers /> {member.members || 0}</span>
//                 <p>Level: {member.level}</p>
//               </div>

//               {member.children?.length > 0 && (
//                 <div className="has-children">
//                   ↓ {member.children.length} downline
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {members.some(m => m.children?.length > 0) && (
//           <div className="next-level">
//             {renderLevel(
//               members.flatMap(m => m.children || []),
//               //Sab members ke children ko ek flat array me convert
//               level + 1
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <BasePage
//       title="Matrix Tree"
//       subtitle="View your network"
//       icon={<FaUserFriends />}
//     >
//       <div className="genealogy-sponsor-content">

//         {loading && <p>Loading...</p>}
//         {error && <p style={{ color: 'red' }}>{error}</p>}

//         {treeData && (
//           <>
//             {/* 📊 STATS ALWAYS SHOW */}
//             <div className="sponsor-stats">
//               <div className="stat-card">
//                 <div className="stat-label">Total Network</div>
//                 <div className="stat-value">
//                   {treeData?.members ?? 0}
//                 </div>
//               </div>

//               <div className="stat-card">
//                 <div className="stat-label">Total Volume</div>
//                 <div className="stat-value">
//                   ${(treeData?.volume ?? 0).toLocaleString()}
//                 </div>
//               </div>

//               <div className="stat-card">
//                 <div className="stat-label">Direct Referrals</div>
//                 <div className="stat-value">
//                   {treeData?.children?.length ?? 0}
//                 </div>
//               </div>
//             </div>

//             {/* 🌳 TREE ONLY WHEN DATA AVAILABLE */}
//             {treeData && (
//               <div className="sponsor-tree-container">
//                 <div className="root-member">
//                   <div className="member-card root">
//                     <div className="member-name">{treeData.name}</div>

//                     <div className="member-stats">
//                       <span><FaChartLine /> ${(treeData.volume || 0).toLocaleString()}</span>
//                       <span><FaUsers /> {treeData.members}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {renderLevel(treeData.children, 1)}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </BasePage>
//   );
// };

// export default GenealogySponsor;




import React, { useEffect, useState } from 'react';

import BasePage from '../Pages/BasePage';

import {
  FaUserFriends,
  FaUsers,
  FaChartLine
} from 'react-icons/fa';

import './GenealogySponsor.css';

import AuthService from '../../Apis/AuthService/AuthService';

const GenealogySponsor = ({ user }) => {

  // =========================
  // STATES
  // =========================

  const [treeData, setTreeData] = useState(null);

  const [matrixType, setMatrixType] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =========================
  // API CALL
  // =========================

  useEffect(() => {
    fetchSponsorTree();
  }, []);

  const fetchSponsorTree = async () => {

  try {

    setLoading(true);

    const response = await AuthService.getSponsorTree();

    console.log("MATRIX TREE RESPONSE =>", response);

    if (!response?.success) {

      setError(
        response?.message || "Failed to load matrix tree"
      );

      return;
    }

    // ✅ BACKEND DATA
    const data = response?.data;

    // ✅ SAVE TREE
    setTreeData(data);

    // ✅ MATRIX TYPE
    setMatrixType(response?.type || "");

  } catch (error) {

    console.error(error);

    setError("Something went wrong");

  } finally {

    setLoading(false);
  }
};

  // =========================
  // CALCULATE TOTAL MEMBERS
  // =========================

  const calculateMembers = (node) => {

    if (!node) return 0;

    return (
      (node?.stats?.totalMembers || 0) +

      calculateMembers(node?.children?.left) +

      calculateMembers(node?.children?.mid) +

      calculateMembers(node?.children?.right)
    );
  };

  // =========================
  // CALCULATE TOTAL AMOUNT
  // =========================

  const calculateAmount = (node) => {

    if (!node) return 0;

    return (
      (node?.stats?.totalAmount || 0) +

      calculateAmount(node?.children?.left) +

      calculateAmount(node?.children?.mid) +

      calculateAmount(node?.children?.right)
    );
  };

  // =========================
  // RENDER NODE
  // =========================

  const renderNode = (node, isRoot = false) => {

    if (!node) return null;

    return (
      <div
        className={`tree-node ${isRoot ? 'root' : ''}`}
      >

        {/* ========================= */}
        {/* NODE CARD */}
        {/* ========================= */}

        <div className="member-card">

          <div className="member-name">
            {node?.name || "N/A"}
          </div>

          <div className="member-level">
            Level {node?.level || 0}
          </div>

          <div className="member-date">
            {
              node?.createdAt
                ? new Date(node.createdAt).toLocaleDateString()
                : "N/A"
            }
          </div>

          <div className="member-stats">

            <span>
              <FaChartLine />

              ₹{(
                node?.stats?.totalAmount || 0
              ).toLocaleString()}
            </span>

            <span>
              <FaUsers />

              {node?.stats?.totalMembers || 0}
            </span>

          </div>

        </div>

        {/* ========================= */}
        {/* CHILDREN */}
        {/* ========================= */}

        {(node?.children?.left ||
          node?.children?.mid ||
          node?.children?.right) && (

            <div className="children-wrapper">

              {/* LEFT */}

              {node?.children?.left && (

                <div className="child-node left">

                  <div className="child-label">
                    Left
                  </div>

                  {renderNode(node.children.left)}

                </div>
              )}

              {/* MID */}

              {node?.children?.mid && (

                <div className="child-node mid">

                  <div className="child-label">
                    Middle
                  </div>

                  {renderNode(node.children.mid)}

                </div>
              )}

              {/* RIGHT */}

              {node?.children?.right && (

                <div className="child-node right">

                  <div className="child-label">
                    Right
                  </div>

                  {renderNode(node.children.right)}

                </div>
              )}

            </div>
          )}

      </div>
    );
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <BasePage
        title="Matrix Tree"
        subtitle="Loading..."
        icon={<FaUserFriends />}
      >

        <div className="loading-text">
          Loading Matrix Tree...
        </div>

      </BasePage>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {

    return (
      <BasePage
        title="Matrix Tree"
        subtitle="Error"
        icon={<FaUserFriends />}
      >

        <div className="error-text">
          {error}
        </div>

      </BasePage>
    );
  }

  // =========================
  // STATS
  // =========================

  const totalMembers =
    calculateMembers(treeData);

  const totalAmount =
    calculateAmount(treeData);

  const directReferrals =
    [
      treeData?.children?.left,
      treeData?.children?.mid,
      treeData?.children?.right
    ].filter(Boolean).length;

  // =========================
  // JSX
  // =========================

  return (
    <BasePage
      title="Matrix Tree"
      subtitle="View your matrix network structure"
      icon={<FaUserFriends />}
    >

      <div className="genealogy-sponsor-content">

        {/* ========================= */}
        {/* TOP STATS */}
        {/* ========================= */}

        <div className="sponsor-stats">

          <div className="stat-card">
  <div className="stat-label">
    Left Count
  </div>

  <div className="stat-value">
    {treeData?.stats?.leftCount || 0}
  </div>
</div>

<div className="stat-card">
  <div className="stat-label">
    Mid Count
  </div>

  <div className="stat-value">
    {treeData?.stats?.midCount || 0}
  </div>
</div>

<div className="stat-card">
  <div className="stat-label">
    Right Count
  </div>

  <div className="stat-value">
    {treeData?.stats?.rightCount || 0}
  </div>
</div>

        </div>

        {/* ========================= */}
        {/* TREE */}
        {/* ========================= */}

        <div className="sponsor-tree-container">

          {
            treeData
              ? renderNode(treeData, true)
              : (
                <div className="empty-tree">
                  No Matrix Data Found
                </div>
              )
          }

        </div>

      </div>

    </BasePage>
  );
};

export default GenealogySponsor;