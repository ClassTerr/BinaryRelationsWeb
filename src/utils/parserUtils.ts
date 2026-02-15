import type { Edge, Node } from '../types';

export interface ParseResult {
  success: boolean;
  edges: Edge[];
  nodes: Node[];
  error?: string;
}

// Normalize edge to ensure source/target are strings
export function normalizeEdge(edge: Edge): Edge {
  const source = edge.source;
  const target = edge.target;
  return {
    source: typeof source === 'string' ? source : (source as Node).id || String(source),
    target: typeof target === 'string' ? target : (target as Node).id || String(target),
  };
}

// Normalize all edges in an array
export function normalizeEdges(edges: Edge[]): Edge[] {
  return edges.map(normalizeEdge);
}

// Parse relation text into edges and nodes
export function parseRelationText(text: string): ParseResult {
  try {
    // Remove common prefixes and clean up
    const cleaned = text
      .replace(/^R\s*=\s*/i, '')
      .replace(/^Define\s+.*?by:\s*/i, '')
      .replace(/^\s*Let\s+.*?\.\s*/im, '')
      .trim();
    
    // Extract all pairs (a, b)
    const pairRegex = /\(\s*([^,\s)]+)\s*,\s*([^,\s)]+)\s*\)/g;
    const pairs: Edge[] = [];
    const nodeSet = new Set<string>();
    
    let match;
    while ((match = pairRegex.exec(cleaned)) !== null) {
      const source = match[1].trim();
      const target = match[2].trim();
      pairs.push({ source, target });
      nodeSet.add(source);
      nodeSet.add(target);
    }
    
    if (pairs.length === 0) {
      return {
        success: false,
        edges: [],
        nodes: [],
        error: 'No valid pairs found. Format: (a, b), (c, d), ...',
      };
    }
    
    // Create nodes
    const nodes: Node[] = Array.from(nodeSet).map((label) => ({
      id: label,
      label,
      x: 0,
      y: 0,
    }));
    
    return {
      success: true,
      edges: pairs,
      nodes,
    };
  } catch (error) {
    return {
      success: false,
      edges: [],
      nodes: [],
      error: error instanceof Error ? error.message : 'Unknown parsing error',
    };
  }
}

// Format edges as relation text
export function formatRelationText(edges: Edge[]): string {
  if (edges.length === 0) {
    return 'R = { }';
  }
  
  // Normalize edges first
  const normalized = normalizeEdges(edges);
  
  const sortedEdges = [...normalized].sort((a, b) => {
    const sourceA = String(a.source);
    const sourceB = String(b.source);
    if (sourceA !== sourceB) {
      return sourceA.localeCompare(sourceB);
    }
    const targetA = String(a.target);
    const targetB = String(b.target);
    return targetA.localeCompare(targetB);
  });
  
  const pairs = sortedEdges.map(e => `(${e.source}, ${e.target})`).join(', ');
  return `R = { ${pairs} }`;
}
