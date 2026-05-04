// Helper functions for tree operations

/**
 * Convert flat array to tree structure
 */
export const buildTreeFromFlat = (items, parentId = null, parentKey = 'parentId') => {
  return items
    .filter(item => item[parentKey] === parentId)
    .map(item => ({
      ...item,
      children: buildTreeFromFlat(items, item.id, parentKey),
    }));
};

/**
 * Flatten tree structure to array
 */
export const flattenTree = (tree, result = []) => {
  tree.forEach(node => {
    result.push(node);
    if (node.children && node.children.length > 0) {
      flattenTree(node.children, result);
    }
  });
  return result;
};

/**
 * Find node in tree by ID
 */
export const findNodeById = (tree, id) => {
  for (const node of tree) {
    if (node.id === id) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Get all descendants of a node
 */
export const getDescendants = (node) => {
  let descendants = [];
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      descendants.push(child);
      descendants = descendants.concat(getDescendants(child));
    });
  }
  return descendants;
};

/**
 * Calculate tree statistics
 */
export const calculateTreeStats = (tree) => {
  const stats = {
    totalNodes: 0,
    totalLevels: 0,
    nodesByLevel: {},
  };

  const traverse = (nodes, level = 1) => {
    stats.totalLevels = Math.max(stats.totalLevels, level);
    nodes.forEach(node => {
      stats.totalNodes++;
      stats.nodesByLevel[level] = (stats.nodesByLevel[level] || 0) + 1;
      if (node.children && node.children.length > 0) {
        traverse(node.children, level + 1);
      }
    });
  };

  traverse(tree);
  return stats;
};

/**
 * Convert tree to D3 format
 */
export const convertToD3Format = (node) => {
  return {
    name: node.name || `ID: ${node.id}`,
    attributes: {
      id: node.id,
      level: node.level || 1,
      referrals: node.referrals || 0,
      earnings: node.totalEarnings || '$0',
      joinDate: node.joinDate || '',
    },
    children: node.children && node.children.length > 0
      ? node.children.map(convertToD3Format)
      : undefined,
  };
};
