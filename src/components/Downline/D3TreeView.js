import React, { useEffect, useRef } from 'react';
import { useAppSelector } from '../../store/hooks';
import { convertToD3Format } from '../../utils/treeHelpers';
import { LEVEL_COLORS } from '../../utils/constants';
import * as d3 from 'd3';
import './D3TreeView.css';

const D3TreeView = ({ width = 1200, height = 800 }) => {
  const svgRef = useRef(null);
  const { treeData } = useAppSelector((state) => state.downline);

  useEffect(() => {
    if (!treeData || treeData.length === 0 || !svgRef.current) return;

    // Clear previous render
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const g = svg.append('g');

    // Convert to D3 format
    const rootData = {
      name: 'Root',
      children: treeData.map(convertToD3Format),
    };

    const root = d3.hierarchy(rootData);
    const treeLayout = d3.tree().size([height - 100, width - 200]);

    treeLayout(root);

    // Links
    g
      .selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal()
        .x(d => d.y + 100)
        .y(d => d.x + 50)
      )
      .attr('fill', 'none')
      .attr('stroke', '#6366f1')
      .attr('stroke-width', 2)
      .attr('opacity', 0.6);

    // Nodes
    const nodes = g
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y + 100},${d.x + 50})`);

    // Node circles
    nodes
      .append('circle')
      .attr('r', 25)
      .attr('fill', d => {
        const level = d.depth;
        return LEVEL_COLORS[level] || LEVEL_COLORS[5];
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .style('cursor', 'pointer')
      .on('mouseover', function() {
        d3.select(this).attr('r', 30);
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 25);
      });

    // Node labels
    nodes
      .append('text')
      .attr('dy', 40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1e293b')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .text(d => {
        if (d.depth === 0) return 'Root';
        return d.data.name.length > 15 
          ? d.data.name.substring(0, 15) + '...' 
          : d.data.name;
      });

    // Node details
    nodes
      .append('text')
      .attr('dy', 55)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', '10px')
      .text(d => {
        if (d.depth === 0) return '';
        return `Level ${d.data.attributes?.level || d.depth} • ${d.data.attributes?.referrals || 0} refs`;
      });

    // Tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'd3-tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.9)')
      .style('color', 'white')
      .style('padding', '12px')
      .style('border-radius', '8px')
      .style('pointer-events', 'none')
      .style('z-index', 1000);

    nodes
      .on('mouseover', function(event, d) {
        if (d.depth === 0) return;
        tooltip
          .style('opacity', 1)
          .html(`
            <strong>${d.data.name}</strong><br/>
            ID: ${d.data.attributes?.id}<br/>
            Level: ${d.data.attributes?.level || d.depth}<br/>
            Referrals: ${d.data.attributes?.referrals || 0}<br/>
            Earnings: ${d.data.attributes?.earnings || '$0'}<br/>
            Join Date: ${d.data.attributes?.joinDate || 'N/A'}
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        tooltip.style('opacity', 0);
      });

    // Zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Cleanup
    return () => {
      d3.select('body').selectAll('.d3-tooltip').remove();
    };
  }, [treeData, width, height]);

  if (!treeData || treeData.length === 0) {
    return (
      <div className="d3-tree-empty">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No Network Data</h3>
          <p>Start building your network to see the visualization!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d3-tree-container">
      <div className="d3-tree-controls">
        <p className="d3-tree-hint">
          💡 Drag to pan, scroll to zoom
        </p>
      </div>
      <svg ref={svgRef} width={width} height={height} className="d3-tree-svg"></svg>
    </div>
  );
};

export default D3TreeView;
