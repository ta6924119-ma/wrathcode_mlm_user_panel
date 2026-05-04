import { createSlice } from '@reduxjs/toolkit';

// Helper function to build tree structure
const buildTree = (members, parentId = null) => {
  return members
    .filter(member => member.parentId === parentId)
    .map(member => ({
      ...member,
      children: buildTree(members, member.id),
    }));
};

const initialState = {
  members: [],
  treeData: null,
  selectedMember: null,
  searchTerm: '',
  filterLevel: 'all',
  expandedNodes: [],
  isLoading: false,
  error: null,
};

const downlineSlice = createSlice({
  name: 'downline',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setMembers: (state, action) => {
      state.members = action.payload;
      // Build tree structure
      state.treeData = buildTree(action.payload);
    },
    addMember: (state, action) => {
      state.members.push(action.payload);
      state.treeData = buildTree(state.members);
    },
    setSelectedMember: (state, action) => {
      state.selectedMember = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilterLevel: (state, action) => {
      state.filterLevel = action.payload;
    },
    toggleNode: (state, action) => {
      const nodeId = action.payload;
      const index = state.expandedNodes.indexOf(nodeId);
      if (index > -1) {
        state.expandedNodes.splice(index, 1);
      } else {
        state.expandedNodes.push(nodeId);
      }
    },
    expandAll: (state) => {
      const getAllNodeIds = (nodes) => {
        let ids = [];
        nodes.forEach(node => {
          ids.push(node.id);
          if (node.children && node.children.length > 0) {
            ids = ids.concat(getAllNodeIds(node.children));
          }
        });
        return ids;
      };
      state.expandedNodes = getAllNodeIds(state.treeData || []);
    },
    collapseAll: (state) => {
      state.expandedNodes = [];
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setMembers,
  addMember,
  setSelectedMember,
  setSearchTerm,
  setFilterLevel,
  toggleNode,
  expandAll,
  collapseAll,
  setError,
} = downlineSlice.actions;

export default downlineSlice.reducer;
