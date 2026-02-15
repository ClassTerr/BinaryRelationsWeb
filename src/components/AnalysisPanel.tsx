import React from 'react';
import { useTranslation } from 'react-i18next';
import type { AnalysisResult, NotationStyle, Edge } from '../types';
import { formatAnalysis } from '../utils/formatterUtils';
import './AnalysisPanel.css';

interface AnalysisPanelProps {
  analysis: AnalysisResult;
  edges: Edge[];
  notation: NotationStyle;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, edges, notation }) => {
  const { t } = useTranslation();

  const formattedAnalysis = formatAnalysis(
    edges,
    analysis.domain,
    analysis.range,
    analysis.union,
    analysis.identityRelation,
    analysis.inverseRelation,
    analysis.composition,
    notation
  );

  const properties = [
    { key: 'reflexive', value: analysis.properties.reflexive },
    { key: 'irreflexive', value: analysis.properties.irreflexive },
    { key: 'symmetric', value: analysis.properties.symmetric },
    { key: 'antisymmetric', value: analysis.properties.antisymmetric },
    { key: 'asymmetric', value: analysis.properties.asymmetric },
    { key: 'transitive', value: analysis.properties.transitive },
    { key: 'intransitive', value: analysis.properties.intransitive },
    { key: 'total', value: analysis.properties.total },
    { key: 'trichotomous', value: analysis.properties.trichotomous },
    { key: 'euclidean', value: analysis.properties.euclidean },
  ];

  return (
    <div className="analysis-panel">
      <h3 className="analysis-title">{t('analysis.title')}</h3>

      {/* Formatted Analysis */}
      <div className="analysis-section">
        <pre className="analysis-text">{formattedAnalysis}</pre>
      </div>

      {/* Properties */}
      <div className="analysis-section">
        <h4 className="section-title">{t('analysis.properties')}</h4>
        <div className="properties-grid">
          {properties.map(prop => (
            <div
              key={prop.key}
              className={`property-item ${prop.value ? 'property-true' : 'property-false'}`}
              title={t(`properties.${prop.key}_desc`)}
            >
              <span className="property-icon">
                {prop.value ? '✓' : '✗'}
              </span>
              <span className="property-name">
                {t(`properties.${prop.key}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;
