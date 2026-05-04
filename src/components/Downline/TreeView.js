import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { LEVEL_COLORS } from '../../utils/constants';
import { FaChevronDown, FaChevronRight, FaUser } from 'react-icons/fa';
import './TreeView.css';

const TreeNode = ({ node, level = 1, onNodeClick, isExpanded, onToggle, selectedId, parentPath = [], isLast = false, hasSiblings = false, expandedSet, maxLevel = 3 }) => {
  const hasChildren = node.children && node.children.length > 0 && level < maxLevel;
  const isSelected = selectedId === node.id;
  const levelColor = LEVEL_COLORS[level] || LEVEL_COLORS[5];
  const indentLevel = level - 1;
  const hasMoreChildren = node.children && node.children.length > 0 && level >= maxLevel;

  // Generate avatar color based on name
  const getAvatarColor = (name) => {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#06b6d4', '#f97316'];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  return (
    <div className={`tree-node-mobile level-${level}`}>
      <div
        className={`tree-node-content ${isSelected ? 'selected' : ''} ${isLast ? 'last-node' : ''}`}
        style={{ paddingLeft: `${indentLevel * 28 + 16}px` }}
      >
        {/* Vertical connecting line */}
        {level > 1 && (
          <>
            <div
              className={`tree-connector-vertical ${isLast ? 'last' : ''}`}
              style={{ left: `${(indentLevel - 1) * 28 + 16}px` }}
            />
            {/* Horizontal connecting line */}
            <div
              className="tree-connector-horizontal"
              style={{ left: `${(indentLevel - 1) * 28 + 16}px` }}
            />
          </>
        )}

        <div className="tree-node-row" onClick={() => onNodeClick(node)}>
          {/* Expand/Collapse Icon */}
          {hasChildren ? (
            <button
              className={`tree-expand-btn ${isExpanded ? 'expanded' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggle(node.id);
              }}
            >
              {isExpanded ? (
                <FaChevronDown className="tree-arrow-icon" />
              ) : (
                <FaChevronRight className="tree-arrow-icon" />
              )}
            </button>
          ) : (
            <div className="tree-expand-spacer">
              <FaUser className="tree-user-icon" />
            </div>
          )}

          {/* Avatar */}
          <div
            className={`tree-avatar ${isSelected ? 'selected-avatar' : ''}`}
            style={{
              backgroundColor: getAvatarColor(node.name),
              boxShadow: isSelected ? `0 0 0 3px rgba(99, 102, 241, 0.3)` : '0 2px 8px rgba(0, 0, 0, 0.2)'
            }}
          >
            {node.name ? node.name.charAt(0).toUpperCase() : 'U'}
          </div>

          {/* User Name */}
          <div className={`tree-node-name ${isSelected ? 'selected-name' : ''}`}>
            {node.name || `Member ${node.id}`}
          </div>

          {/* Show indicator if there are more levels */}
          {hasMoreChildren && (
            <div className="tree-more-indicator" title={`${node.children.length} more member(s) below level ${maxLevel}`}>
              <span className="tree-more-count">+{node.children.length}</span>
            </div>
          )}
        </div>
      </div>

      {hasChildren && (
        <div className={`tree-node-children ${isExpanded ? 'expanded' : 'collapsed'}`}>
          {node.children.map((child, index) => {
            const childExpanded = expandedSet?.has?.(child.id) || false;
            return (
              <TreeNode
                key={child.id}
                node={child}
                level={level + 1}
                onNodeClick={onNodeClick}
                isExpanded={childExpanded}
                onToggle={onToggle}
                selectedId={selectedId}
                parentPath={[...parentPath, node.id]}
                isLast={index === node.children.length - 1}
                hasSiblings={node.children.length > 1}
                expandedSet={expandedSet}
                maxLevel={maxLevel}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const TreeView = ({ onNodeSelect }) => {
  const { treeData, expandedNodes, selectedMember } = useAppSelector((state) => state.downline);
  const [localExpanded, setLocalExpanded] = useState(new Set(expandedNodes));
  const [localSelected, setLocalSelected] = useState(selectedMember?.id || null);

  useEffect(() => {
    setLocalExpanded(new Set(expandedNodes));
  }, [expandedNodes]);

  useEffect(() => {
    setLocalSelected(selectedMember?.id || null);
  }, [selectedMember]);

  const handleToggle = (nodeId) => {
    const newExpanded = new Set(localExpanded);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setLocalExpanded(newExpanded);
  };

  const handleNodeClick = (node) => {
    setLocalSelected(node.id);
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  };

  if (!treeData || treeData.length === 0) {
    return (
      <div className="tree-view-empty">
        <div className="empty-state">
          <div className="empty-icon">🌳</div>
          <h3>No Network Data</h3>
          <p>Start building your network by referring members!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tree-view-container">
      <div className="tree-view">
        {treeData.map((rootNode, index) => (
          <TreeNode
            key={rootNode.id}
            node={rootNode}
            level={1}
            onNodeClick={handleNodeClick}
            isExpanded={localExpanded.has(rootNode.id)}
            onToggle={handleToggle}
            selectedId={localSelected}
            isLast={index === treeData.length - 1}
            hasSiblings={treeData.length > 1}
            expandedSet={localExpanded}
            maxLevel={3}
          />
        ))}
      </div>
    </div>
  );
};

export default TreeView;
