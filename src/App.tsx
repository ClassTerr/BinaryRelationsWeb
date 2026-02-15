import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import GraphCanvas from './components/GraphCanvas';
import TextInput from './components/TextInput';
import AnalysisPanel from './components/AnalysisPanel';
import type { Node, Edge, NotationStyle } from './types';
import { analyzeRelation } from './utils/relationUtils';
import {
  getNotationPreference,
  saveNotationPreference,
  getGraphStateFromURL,
  updateURLWithGraphState,
} from './utils/storageUtils';
import './App.css';

function App() {
  const { t } = useTranslation();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [notation, setNotation] = useState<NotationStyle>(getNotationPreference());
  const [copySuccess, setCopySuccess] = useState(false);

  // Load state from URL on mount
  useEffect(() => {
    const urlState = getGraphStateFromURL();
    if (urlState) {
      // Use setTimeout to avoid calling setState directly in effect
      setTimeout(() => {
        setNodes(urlState.nodes);
        setEdges(urlState.edges);
      }, 0);
    }
  }, []);

  // Update URL when graph changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (nodes.length > 0 || edges.length > 0) {
        updateURLWithGraphState({ nodes, edges });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [nodes, edges]);

  // Handle notation change
  const handleNotationChange = useCallback(() => {
    const newNotation: NotationStyle = notation === 'roster' ? 'set-builder' : 'roster';
    setNotation(newNotation);
    saveNotationPreference(newNotation);
  }, [notation]);

  // Handle clear all
  const handleClearAll = useCallback(() => {
    if (window.confirm(t('app.clearAll') + '?')) {
      setNodes([]);
      setEdges([]);
    }
  }, [t]);

  // Handle copy link
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  }, []);

  // Handle load example
  const handleLoadExample = useCallback(() => {
    const exampleNodes: Node[] = [
      { id: '1', label: '1', x: 200, y: 200 },
      { id: '2', label: '2', x: 400, y: 200 },
      { id: '3', label: '3', x: 300, y: 350 },
      { id: '4', label: '4', x: 500, y: 350 },
    ];
    const exampleEdges: Edge[] = [
      { source: '2', target: '1' },
      { source: '4', target: '2' },
      { source: '1', target: '3' },
      { source: '2', target: '3' },
    ];
    setNodes(exampleNodes);
    setEdges(exampleEdges);
  }, []);

  // Handle parsed text input
  const handleTextParsed = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    // Position new nodes in a circle if they don't have positions
    const radius = 200;
    const centerX = 400;
    const centerY = 300;
    
    const positionedNodes = newNodes.map((node, index) => {
      if (node.x === 0 && node.y === 0) {
        const angle = (2 * Math.PI * index) / newNodes.length;
        return {
          ...node,
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        };
      }
      return node;
    });

    setNodes(positionedNodes);
    setEdges(newEdges);
  }, []);

  // Analyze the current relation
  const analysis = analyzeRelation(edges);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">{t('app.title')}</h1>
        <div className="app-controls">
          <button
            className="btn btn-secondary"
            onClick={handleNotationChange}
            title={t('notation.switch')}
          >
            {t('notation.label')}: {notation === 'roster' ? t('notation.roster') : t('notation.setBuilder')}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleLoadExample}
          >
            {t('app.loadExample')}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleCopyLink}
          >
            {copySuccess ? t('app.linkCopied') : t('app.copyLink')}
          </button>
          <button
            className="btn btn-danger"
            onClick={handleClearAll}
          >
            {t('app.clearAll')}
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="app-left">
          <div className="canvas-container">
            <GraphCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={setNodes}
              onEdgesChange={setEdges}
            />
          </div>
          <TextInput edges={edges} onParsed={handleTextParsed} />
        </div>

        <div className="app-right">
          <AnalysisPanel analysis={analysis} edges={edges} notation={notation} />
        </div>
      </main>
    </div>
  );
}

export default App;
