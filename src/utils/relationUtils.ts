import type { Edge, Properties, AnalysisResult } from '../types';
import { normalizeEdges } from './parserUtils';

// Get domain (all first elements)
export function getDomain(edges: Edge[]): Set<string> {
  const normalized = normalizeEdges(edges);
  return new Set(normalized.map(e => String(e.source)));
}

// Get range (all second elements)
export function getRange(edges: Edge[]): Set<string> {
  const normalized = normalizeEdges(edges);
  return new Set(normalized.map(e => String(e.target)));
}

// Get union (all elements appearing in the relation)
export function getUnion(edges: Edge[]): Set<string> {
  const normalized = normalizeEdges(edges);
  const union = new Set<string>();
  normalized.forEach(e => {
    union.add(String(e.source));
    union.add(String(e.target));
  });
  return union;
}

// Get identity relation on a set
export function getIdentityRelation(elements: Set<string>): Edge[] {
  return Array.from(elements).map(e => ({ source: e, target: e }));
}

// Get inverse relation
export function getInverseRelation(edges: Edge[]): Edge[] {
  const normalized = normalizeEdges(edges);
  return normalized.map(e => ({ source: String(e.target), target: String(e.source) }));
}

// Get composition R ∘ R
export function getComposition(edges: Edge[]): Edge[] {
  const normalized = normalizeEdges(edges);
  const composition: Edge[] = [];
  const edgeSet = new Set(normalized.map(e => `${e.source},${e.target}`));
  
  normalized.forEach(e1 => {
    normalized.forEach(e2 => {
      if (String(e1.target) === String(e2.source)) {
        const newEdge = { source: String(e1.source), target: String(e2.target) };
        const key = `${newEdge.source},${newEdge.target}`;
        if (!edgeSet.has(key) && !composition.some(e => e.source === newEdge.source && e.target === newEdge.target)) {
          composition.push(newEdge);
        }
      }
    });
  });
  
  return composition;
}

// Check if relation is reflexive
export function isReflexive(edges: Edge[], elements: Set<string>): boolean {
  const normalized = normalizeEdges(edges);
  return Array.from(elements).every(a => 
    normalized.some(e => String(e.source) === a && String(e.target) === a)
  );
}

// Check if relation is irreflexive
export function isIrreflexive(edges: Edge[], elements: Set<string>): boolean {
  const normalized = normalizeEdges(edges);
  return Array.from(elements).every(a => 
    !normalized.some(e => String(e.source) === a && String(e.target) === a)
  );
}

// Check if relation is symmetric
export function isSymmetric(edges: Edge[]): boolean {
  const normalized = normalizeEdges(edges);
  return normalized.every(e => 
    normalized.some(e2 => String(e2.source) === String(e.target) && String(e2.target) === String(e.source))
  );
}

// Check if relation is antisymmetric
export function isAntisymmetric(edges: Edge[]): boolean {
  const normalized = normalizeEdges(edges);
  return normalized.every(e => {
    const reverse = normalized.find(e2 => String(e2.source) === String(e.target) && String(e2.target) === String(e.source));
    return !reverse || String(e.source) === String(e.target);
  });
}

// Check if relation is asymmetric
export function isAsymmetric(edges: Edge[]): boolean {
  const normalized = normalizeEdges(edges);
  return normalized.every(e => 
    !normalized.some(e2 => String(e2.source) === String(e.target) && String(e2.target) === String(e.source))
  );
}

// Check if relation is transitive
export function isTransitive(edges: Edge[]): boolean {
  const normalized = normalizeEdges(edges);
  for (const e1 of normalized) {
    for (const e2 of normalized) {
      if (String(e1.target) === String(e2.source)) {
        const hasComposition = normalized.some(e3 => 
          String(e3.source) === String(e1.source) && String(e3.target) === String(e2.target)
        );
        if (!hasComposition) {
          return false;
        }
      }
    }
  }
  return true;
}

// Check if relation is intransitive
export function isIntransitive(edges: Edge[]): boolean {
  const normalized = normalizeEdges(edges);
  for (const e1 of normalized) {
    for (const e2 of normalized) {
      if (String(e1.target) === String(e2.source)) {
        const hasComposition = normalized.some(e3 => 
          String(e3.source) === String(e1.source) && String(e3.target) === String(e2.target)
        );
        if (hasComposition) {
          return false;
        }
      }
    }
  }
  return true;
}

// Check if relation is total (complete)
export function isTotal(edges: Edge[], elements: Set<string>): boolean {
  const normalized = normalizeEdges(edges);
  const arr = Array.from(elements);
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (i !== j) {
        const hasRelation = normalized.some(e => 
          (String(e.source) === arr[i] && String(e.target) === arr[j]) ||
          (String(e.source) === arr[j] && String(e.target) === arr[i])
        );
        if (!hasRelation) {
          return false;
        }
      }
    }
  }
  return true;
}

// Check if relation is trichotomous
export function isTrichotomous(edges: Edge[], elements: Set<string>): boolean {
  const normalized = normalizeEdges(edges);
  const arr = Array.from(elements);
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      const a = arr[i];
      const b = arr[j];
      const equal = a === b;
      const hasAB = normalized.some(e => String(e.source) === a && String(e.target) === b);
      const hasBA = normalized.some(e => String(e.source) === b && String(e.target) === a);
      
      const trueCount = [equal, hasAB, hasBA].filter(Boolean).length;
      if (trueCount !== 1) {
        return false;
      }
    }
  }
  return true;
}

// Check if relation is Euclidean
export function isEuclidean(edges: Edge[]): boolean {
  const normalized = normalizeEdges(edges);
  for (const e1 of normalized) {
    for (const e2 of normalized) {
      if (String(e1.source) === String(e2.source)) {
        const hasRelation = normalized.some(e3 => 
          String(e3.source) === String(e1.target) && String(e3.target) === String(e2.target)
        );
        if (!hasRelation) {
          return false;
        }
      }
    }
  }
  return true;
}

// Analyze the relation
export function analyzeRelation(edges: Edge[]): AnalysisResult {
  const domain = getDomain(edges);
  const range = getRange(edges);
  const union = getUnion(edges);
  
  const properties: Properties = {
    reflexive: isReflexive(edges, union),
    irreflexive: isIrreflexive(edges, union),
    symmetric: isSymmetric(edges),
    antisymmetric: isAntisymmetric(edges),
    asymmetric: isAsymmetric(edges),
    transitive: isTransitive(edges),
    intransitive: isIntransitive(edges),
    total: isTotal(edges, union),
    trichotomous: isTrichotomous(edges, union),
    euclidean: isEuclidean(edges),
  };
  
  return {
    domain,
    range,
    union,
    identityRelation: getIdentityRelation(union),
    inverseRelation: getInverseRelation(edges),
    composition: getComposition(edges),
    properties,
  };
}
