// Core data types for the Binary Relations Visualizer

export interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
}

export interface Edge {
  source: string;
  target: string;
}

export interface GraphState {
  nodes: Node[];
  edges: Edge[];
}

export type NotationStyle = 'roster' | 'set-builder';

export interface Properties {
  reflexive: boolean;
  irreflexive: boolean;
  symmetric: boolean;
  antisymmetric: boolean;
  asymmetric: boolean;
  transitive: boolean;
  intransitive: boolean;
  total: boolean;
  trichotomous: boolean;
  euclidean: boolean;
}

export interface AnalysisResult {
  domain: Set<string>;
  range: Set<string>;
  union: Set<string>;
  identityRelation: Edge[];
  inverseRelation: Edge[];
  composition: Edge[];
  properties: Properties;
}
