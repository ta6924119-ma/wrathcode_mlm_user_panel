// import React, { useState, useEffect } from 'react';
// import BasePage from '../Pages/BasePage';
// import { FaSitemap, FaUsers, FaChartLine } from 'react-icons/fa';
// import './GenealogyBinary.css';
// import AuthService from '../../Apis/AuthService/AuthService';
// import LoaderHelper from '../../utils/Loading/LoaderHelper';
// import { alertErrorMessage } from '../../utils/CustomAlertMessage/index';

// const GenealogyBinary = ({ user }) => {
//   const [selectedNode, setSelectedNode] = useState(null);
//   const [treeData, setTreeData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     FetchBinaryData();
//   }, []);

//   const FetchBinaryData = async () => {
//     try {
//       setLoading(true);
//       LoaderHelper.loaderStatus(true);

//       const response = await AuthService.getBinaryTree();

//       console.log("API RESPONSE:", response);

//       if (response?.success) {
//         // Handle different possible backend response structures
//         const data = response?.data?.tree || response?.data?.data || response?.data;
//         setTreeData(data);
//       } else {
//         setError(response?.message || "Failed to fetch binary data");
//         alertErrorMessage(response?.message || "Failed to fetch binary data");
//       }

//     } catch (error) {
//       console.error(error);
//       setError("Something went wrong while fetching data");
//       alertErrorMessage("Something went wrong while fetching data");
//     } finally {
//       setLoading(false);
//       LoaderHelper.loaderStatus(false);
//     }
//   };


//   const calculateVolume = (node) => {
//     if (!node) return 0;

//     return (
//       (node.volume || 0) +
//       calculateVolume(node.leftLeg) +
//       calculateVolume(node.rightLeg)
//     );
//   };

//   const totalLeftVolume = calculateVolume(treeData?.leftLeg);
//   const totalRightVolume = calculateVolume(treeData?.rightLeg);
//   const weakLeg = totalLeftVolume < totalRightVolume ? "Left" : "Right";

//   const carryForward = Math.abs(totalLeftVolume - totalRightVolume);
//   const pairingVolume = Math.min(totalLeftVolume, totalRightVolume);

//   const renderNode = (node, isRoot = false) => {
//     if (!node) return null;

//     return (
//       <div className={`tree-node ${isRoot ? 'root' : ''} ${selectedNode?.id === node.id ? 'selected' : ''}`}
//         onClick={() => setSelectedNode(node)}>
//         <div className="node-content">
//           <div className="node-name">{node.name || 'N/A'}</div>
//           <div className="node-stats">
//             <span><FaChartLine /> ${(node.volume || 0).toLocaleString()}</span>
//             <span><FaUsers /> {node.members || 0}</span>
//           </div>
//         </div>
//         {(node.leftLeg || node.rightLeg) && (
//           <div className="node-children">
//             {node.leftLeg && (
//               <div className="child-node left">
//                 {renderNode(node.leftLeg)}
//               </div>
//             )}
//             {node.rightLeg && (
//               <div className="child-node right">

//                 {/* ek recursive function hota hai. like parent -- left child -- uska left child  */}
//                 {renderNode(node.rightLeg)}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <BasePage
//       title="Binary Genealogy"
//       subtitle="View your binary network structure"
//       icon={<FaSitemap />}
//     >
//       <div className="genealogy-binary-content">
//         <div className="binary-stats">
//           <div className="stat-card">
//             <div className="stat-label">Left Leg Volume</div>
//             <div className="stat-value">${totalLeftVolume.toLocaleString()}</div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-label">Right Leg Volume</div>
//             <div className="stat-value">${totalRightVolume.toLocaleString()}</div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-label">Pairing Volume</div>
//             <div className="stat-value">${pairingVolume.toLocaleString()}</div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-label">Carry Forward</div>
//             <div className="stat-value">${carryForward.toLocaleString()}</div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-label">Weak Leg</div>
//             <div className="stat-value">{weakLeg}</div>
//           </div>
//         </div>

//         <div className="tree-container">
//           <div className="tree-wrapper">
//             {treeData && renderNode(treeData, true)} </div>
//         </div>

//         {selectedNode && (
//           <div className="node-details">
//             <h3>Member Details</h3>
//             <div className="details-content">
//               <p><strong>Name:</strong> {selectedNode?.name || 'N/A'}</p>
//               <p><strong>Volume:</strong> ${(selectedNode?.volume || 0).toLocaleString()}</p>
//               <p><strong>Members:</strong> {selectedNode?.members || 0}</p>
//               <p><strong>Status:</strong> Active</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </BasePage>
//   );
// };

// export default GenealogyBinary;



import React, { useState, useEffect } from 'react';
import BasePage from '../Pages/BasePage';
import {
  FaSitemap,
  FaUsers,
  FaChartLine
} from 'react-icons/fa';

import './GenealogyBinary.css';

import AuthService from '../../Apis/AuthService/AuthService';
import LoaderHelper from '../../utils/Loading/LoaderHelper';
import { alertErrorMessage } from '../../utils/CustomAlertMessage/index';

const GenealogyBinary = ({ user }) => {

  // =========================
  // STATES
  // =========================

  const [treeData, setTreeData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [selectedNode, setSelectedNode] = useState(null);

  // =========================
  // API CALL
  // =========================

  useEffect(() => {
    FetchBinaryData();
  }, []);

  const FetchBinaryData = async () => {
    try {

      setLoading(true);

      LoaderHelper.loaderStatus(true);

      const response = await AuthService.getBinaryTree();

      console.log("API RESPONSE:", response);

      if (response?.success) {

        const data =
          response?.data?.tree ||
          response?.data?.data ||
          response?.data;

        setTreeData(data);

      } else {

        setError(
          response?.message || "Failed to fetch binary data"
        );

        alertErrorMessage(
          response?.message || "Failed to fetch binary data"
        );
      }

    } catch (error) {

      console.error(error);

      setError("Something went wrong while fetching data");

      alertErrorMessage(
        "Something went wrong while fetching data"
      );

    } finally {

      setLoading(false);

      LoaderHelper.loaderStatus(false);
    }
  };

  // =========================
  // CALCULATE TOTAL VOLUME
  // =========================

  const calculateVolume = (node) => {

    if (!node) return 0;

    return (
      (node?.stats?.totalAmount || 0) +
      calculateVolume(node?.children?.left) +
      calculateVolume(node?.children?.right)
    );
  };

  // =========================
  // STATS
  // =========================

  const totalLeftVolume =
    calculateVolume(treeData?.children?.left);

  const totalRightVolume =
    calculateVolume(treeData?.children?.right);

  const weakLeg =
    totalLeftVolume < totalRightVolume
      ? "Left"
      : "Right";

  const carryForward = Math.abs(
    totalLeftVolume - totalRightVolume
  );

  const pairingVolume = Math.min(
    totalLeftVolume,
    totalRightVolume
  );

  // =========================
  // TREE NODE RENDER
  // =========================

  const renderNode = (node, isRoot = false) => {

    if (!node) return null;

    return (
      <div
        className={`tree-node ${isRoot ? 'root' : ''} ${selectedNode?._id === node?._id ? 'selected' : ''
          }`}
        onClick={() => setSelectedNode(node)}
      >

        {/* NODE CARD */}

        <div className="node-content">

          <div className="node-name">
            {node?.name || 'N/A'}
          </div>

          <div className="node-level">
            Level {node?.level || 0}
          </div>

          <div className="node-date">
            {node?.createdAt
              ? new Date(node.createdAt).toLocaleDateString()
              : 'N/A'}
          </div>

          <div className="node-stats">

            <span>
              <FaChartLine />
              ₹{(node?.stats?.totalAmount || 0).toLocaleString()}
            </span>

            <span>
              <FaUsers />
              {node?.stats?.totalMembers || 0}
            </span>

          </div>
        </div>

        {/* CHILDREN */}

        {(node?.children?.left ||
          node?.children?.right) && (

            <div className="node-children">

              {node?.children?.left && (
                <div className="child-node left">
                  {renderNode(node.children.left)}
                </div>
              )}

              {node?.children?.right && (
                <div className="child-node right">
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
        title="Binary Genealogy"
        subtitle="Loading..."
        icon={<FaSitemap />}
      >
        <div className="loading-text">
          Loading Binary Tree...
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
        title="Binary Genealogy"
        subtitle="Error"
        icon={<FaSitemap />}
      >
        <div className="error-text">
          {error}
        </div>
      </BasePage>
    );
  }

  // =========================
  // JSX
  // =========================

  return (
    <BasePage
      title="Binary Genealogy"
      subtitle="View your binary network structure"
      icon={<FaSitemap />}
    >

      <div className="genealogy-binary-content">

        {/* ========================= */}
        {/* TOP STATS */}
        {/* ========================= */}

        <div className="binary-stats">

          <div className="stat-card">
            <div className="stat-label">
              Left Leg Volume
            </div>

            <div className="stat-value">
              ₹{totalLeftVolume.toLocaleString()}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              Right Leg Volume
            </div>

            <div className="stat-value">
              ₹{totalRightVolume.toLocaleString()}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              Pairing Volume
            </div>

            <div className="stat-value">
              ₹{pairingVolume.toLocaleString()}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              Carry Forward
            </div>

            <div className="stat-value">
              ₹{carryForward.toLocaleString()}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              Weak Leg
            </div>

            <div className="stat-value">
              {weakLeg}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              Total Members
            </div>

            <div className="stat-value">
              {treeData?.stats?.totalMembers || 0}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              Total Amount
            </div>

            <div className="stat-value">
              ₹{(
                treeData?.stats?.totalAmount || 0
              ).toLocaleString()}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              New Joins
            </div>

            <div className="stat-value">
              {treeData?.stats?.totalNewJoins || 0}
            </div>
          </div>

        </div>

        {/* ========================= */}
        {/* TREE */}
        {/* ========================= */}

        <div className="tree-container">

          <div className="tree-wrapper">

            {treeData
              ? renderNode(treeData, true)
              : (
                <div className="empty-tree">
                  No Binary Data Found
                </div>
              )}

          </div>
        </div>

    
        {selectedNode && (

          <div className="node-details">

            <h3>Member Details</h3>

            <div className="details-content">

  <p>
    <strong>Name:</strong>{" "}
    {selectedNode?.name || 'N/A'}
  </p>

  <p>
    <strong>Level:</strong>{" "}
    {selectedNode?.level || 0}
  </p>

  <p>
    <strong>Left Count:</strong>{" "}
    {selectedNode?.stats?.leftCount || 0}
  </p>

  <p>
    <strong>Right Count:</strong>{" "}
    {selectedNode?.stats?.rightCount || 0}
  </p>

  <p>
    <strong>Left New Joins:</strong>{" "}
    {selectedNode?.stats?.leftNewJoins || 0}
  </p>

  <p>
    <strong>Right New Joins:</strong>{" "}
    {selectedNode?.stats?.rightNewJoins || 0}
  </p>

  <p>
    <strong>Joined At:</strong>{" "}
    {selectedNode?.createdAt
      ? new Date(
          selectedNode.createdAt
        ).toLocaleString()
      : 'N/A'}
  </p>

</div>
          </div>
        )}

      </div>
    </BasePage>
  );
};

export default GenealogyBinary;