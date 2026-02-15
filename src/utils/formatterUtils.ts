import type { Edge, NotationStyle } from '../types';
import { normalizeEdges } from './parserUtils';

// Format a set for display
function formatSet(elements: Set<string> | string[]): string {
  const arr = Array.from(elements).sort((a, b) => String(a).localeCompare(String(b)));
  return `{ ${arr.join(', ')} }`;
}

// Format edges for display
function formatEdges(edges: Edge[]): string {
  if (edges.length === 0) return '{ }';
  const normalized = normalizeEdges(edges);
  const sorted = [...normalized].sort((a, b) => {
    const sourceA = String(a.source);
    const sourceB = String(b.source);
    if (sourceA !== sourceB) return sourceA.localeCompare(sourceB);
    const targetA = String(a.target);
    const targetB = String(b.target);
    return targetA.localeCompare(targetB);
  });
  return `{ ${sorted.map(e => `(${e.source}, ${e.target})`).join(', ')} }`;
}

// Format analysis in Roster notation
export function formatRosterNotation(
  edges: Edge[],
  domain: Set<string>,
  range: Set<string>,
  union: Set<string>,
  identity: Edge[],
  inverse: Edge[],
  composition: Edge[]
): string {
  return `R = ${formatEdges(edges)}

D(R) = ${formatSet(domain)}
E(R) = ${formatSet(range)}
O(R) = ${formatSet(union)}

Identity relation: ${formatEdges(identity)}
Inverse relation: ${formatEdges(inverse)}
Composition R ∘ R: ${formatEdges(composition)}`;
}

// Format analysis in Set-Builder notation
export function formatSetBuilderNotation(
  edges: Edge[],
  domain: Set<string>,
  range: Set<string>,
  union: Set<string>,
  identity: Edge[],
  inverse: Edge[],
  composition: Edge[]
): string {
  const unionStr = formatSet(union);
  
  return `Let A = ${unionStr}.

Define a binary relation R ⊆ A × A by:
R = ${formatEdges(edges)}

Domain:
dom(R) = ${formatSet(domain)}

Range (image):
ran(R) = ${formatSet(range)}

Identity relation on A:
I_A = { (a, a) | a ∈ A }
    = ${formatEdges(identity)}

Inverse relation:
R⁻¹ = { (b, a) | (a, b) ∈ R }
    = ${formatEdges(inverse)}

Composition of R with itself:
R ∘ R = { (a, c) | ∃ b ∈ A : (a, b) ∈ R ∧ (b, c) ∈ R }
      = ${formatEdges(composition)}`;
}

// Main formatting function
export function formatAnalysis(
  edges: Edge[],
  domain: Set<string>,
  range: Set<string>,
  union: Set<string>,
  identity: Edge[],
  inverse: Edge[],
  composition: Edge[],
  notation: NotationStyle
): string {
  if (notation === 'roster') {
    return formatRosterNotation(edges, domain, range, union, identity, inverse, composition);
  } else {
    return formatSetBuilderNotation(edges, domain, range, union, identity, inverse, composition);
  }
}
