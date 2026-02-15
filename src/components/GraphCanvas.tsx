import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { Node, Edge } from '../types';
import './GraphCanvas.css';

interface GraphCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [dragLine, setDragLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [dragSource, setDragSource] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement;
        if (container) {
          setDimensions({
            width: container.clientWidth,
            height: container.clientHeight,
          });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Set up force simulation
  useEffect(() => {
    if (nodes.length === 0) return;

    const simulation = d3.forceSimulation<Node>(nodes)
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('collision', d3.forceCollide().radius(40))
      .force('link', d3.forceLink<Node, Edge>(edges)
        .id(d => d.id)
        .distance(100)
      );

    simulation.on('tick', () => {
      onNodesChange([...nodes]);
    });

    return () => {
      simulation.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edges.length, dimensions]);

  // Handle canvas click (add node)
  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.target !== svgRef.current) return;
    if (dragSource) return;

    const rect = svgRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNode: Node = {
      id: `node_${Date.now()}`,
      label: `${nodes.length + 1}`,
      x,
      y,
    };

    onNodesChange([...nodes, newNode]);
  };

  // Handle node drag start (for creating edges)
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation();

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setDragSource(nodeId);
    setDragLine({ x1: node.x, y1: node.y, x2: node.x, y2: node.y });
  };

  // Handle mouse move for edge creation
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragSource || !dragLine) return;

    const rect = svgRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDragLine({ ...dragLine, x2: x, y2: y });
  };

  // Handle node mouse up (complete edge)
  const handleNodeMouseUp = (e: React.MouseEvent, targetId: string) => {
    e.stopPropagation();

    if (!dragSource) return;

    const newEdge: Edge = { source: dragSource, target: targetId };
    
    // Check if edge already exists
    const exists = edges.some(
      e => e.source === dragSource && e.target === targetId
    );

    if (!exists) {
      onEdgesChange([...edges, newEdge]);
    }

    setDragSource(null);
    setDragLine(null);
  };

  // Handle mouse up on canvas (cancel edge creation)
  const handleMouseUp = () => {
    setDragSource(null);
    setDragLine(null);
  };

  // Handle node double-click (edit label)
  const handleNodeDoubleClick = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const newLabel = prompt('Enter new label:', node.label);
    if (newLabel && newLabel.trim()) {
      const updatedNodes = nodes.map(n =>
        n.id === nodeId ? { ...n, label: newLabel.trim() } : n
      );
      onNodesChange(updatedNodes);
    }
  };

  // Handle node right-click (delete)
  const handleNodeContextMenu = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();

    const updatedNodes = nodes.filter(n => n.id !== nodeId);
    const updatedEdges = edges.filter(e => e.source !== nodeId && e.target !== nodeId);

    onNodesChange(updatedNodes);
    onEdgesChange(updatedEdges);
  };

  // Handle edge click (select)
  const handleEdgeClick = (e: React.MouseEvent, source: string, target: string) => {
    e.stopPropagation();
    const edgeKey = `${source}-${target}`;
    setSelectedEdge(selectedEdge === edgeKey ? null : edgeKey);
  };

  // Handle delete key for selected edge
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedEdge) {
        const [source, target] = selectedEdge.split('-');
        const updatedEdges = edges.filter(
          e => !(e.source === source && e.target === target)
        );
        onEdgesChange(updatedEdges);
        setSelectedEdge(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEdge, edges]);

  // Node dragging with D3
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const nodeElements = svg.selectAll<SVGCircleElement, Node>('.node');

    const dragBehavior = d3.drag<SVGCircleElement, Node>()
      .on('start', function() {
        d3.select(this).raise();
      })
      .on('drag', function(event, d) {
        d.x = event.x;
        d.y = event.y;
        onNodesChange([...nodes]);
      });

    nodeElements.call(dragBehavior);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);

  // Draw self-loop arc
  const getSelfLoopPath = (node: Node) => {
    const radius = 25;
    const loopSize = 30;
    return `M ${node.x + radius} ${node.y} 
            C ${node.x + radius + loopSize} ${node.y - loopSize},
              ${node.x + radius + loopSize} ${node.y + loopSize},
              ${node.x + radius} ${node.y}`;
  };

  return (
    <svg
      ref={svgRef}
      width={dimensions.width}
      height={dimensions.height}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="graph-canvas"
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="25"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="#666" />
        </marker>
        <marker
          id="arrowhead-selected"
          markerWidth="10"
          markerHeight="10"
          refX="25"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="#4299e1" />
        </marker>
      </defs>

      {/* Draw edges */}
      {edges.map((edge, idx) => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        if (!sourceNode || !targetNode) return null;

        const edgeKey = `${edge.source}-${edge.target}`;
        const isSelected = selectedEdge === edgeKey;
        const isSelfLoop = edge.source === edge.target;

        if (isSelfLoop) {
          return (
            <path
              key={idx}
              d={getSelfLoopPath(sourceNode)}
              fill="none"
              stroke={isSelected ? '#4299e1' : '#666'}
              strokeWidth={isSelected ? 3 : 2}
              markerEnd={isSelected ? 'url(#arrowhead-selected)' : 'url(#arrowhead)'}
              onClick={(e) => handleEdgeClick(e, edge.source, edge.target)}
              className="edge"
            />
          );
        }

        return (
          <line
            key={idx}
            x1={sourceNode.x}
            y1={sourceNode.y}
            x2={targetNode.x}
            y2={targetNode.y}
            stroke={isSelected ? '#4299e1' : '#666'}
            strokeWidth={isSelected ? 3 : 2}
            markerEnd={isSelected ? 'url(#arrowhead-selected)' : 'url(#arrowhead)'}
            onClick={(e) => handleEdgeClick(e, edge.source, edge.target)}
            className="edge"
          />
        );
      })}

      {/* Draw drag line */}
      {dragLine && (
        <line
          x1={dragLine.x1}
          y1={dragLine.y1}
          x2={dragLine.x2}
          y2={dragLine.y2}
          stroke="#4299e1"
          strokeWidth={2}
          strokeDasharray="5,5"
        />
      )}

      {/* Draw nodes */}
      {nodes.map((node) => (
        <g key={node.id}>
          <circle
            cx={node.x}
            cy={node.y}
            r={25}
            fill="#4299e1"
            stroke="#2c5282"
            strokeWidth={2}
            className="node"
            onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
            onMouseUp={(e) => handleNodeMouseUp(e, node.id)}
            onDoubleClick={() => handleNodeDoubleClick(node.id)}
            onContextMenu={(e) => handleNodeContextMenu(e, node.id)}
          />
          <text
            x={node.x}
            y={node.y}
            textAnchor="middle"
            dy=".3em"
            fill="white"
            fontSize="14"
            fontWeight="bold"
            pointerEvents="none"
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default GraphCanvas;
