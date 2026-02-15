import type { NotationStyle, GraphState } from '../types';

const NOTATION_KEY = 'binaryRelations_notation';
const LANGUAGE_KEY = 'binaryRelations_language';

// Get notation preference
export function getNotationPreference(): NotationStyle {
  const saved = localStorage.getItem(NOTATION_KEY);
  return (saved === 'set-builder' ? 'set-builder' : 'roster') as NotationStyle;
}

// Save notation preference
export function saveNotationPreference(notation: NotationStyle): void {
  localStorage.setItem(NOTATION_KEY, notation);
}

// Get language preference
export function getLanguagePreference(): string {
  return localStorage.getItem(LANGUAGE_KEY) || 'en';
}

// Save language preference
export function saveLanguagePreference(language: string): void {
  localStorage.setItem(LANGUAGE_KEY, language);
}

// Encode graph state to URL
export function encodeGraphState(state: GraphState): string {
  try {
    const json = JSON.stringify(state);
    return btoa(json);
  } catch {
    return '';
  }
}

// Decode graph state from URL
export function decodeGraphState(encoded: string): GraphState | null {
  try {
    const json = atob(encoded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Get graph state from URL
export function getGraphStateFromURL(): GraphState | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('graph');
  return encoded ? decodeGraphState(encoded) : null;
}

// Update URL with graph state
export function updateURLWithGraphState(state: GraphState): void {
  const encoded = encodeGraphState(state);
  const url = new URL(window.location.href);
  url.searchParams.set('graph', encoded);
  window.history.replaceState({}, '', url.toString());
}
