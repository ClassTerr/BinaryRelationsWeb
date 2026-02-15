import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Edge, Node } from '../types';
import { parseRelationText, formatRelationText } from '../utils/parserUtils';
import './TextInput.css';

interface TextInputProps {
  edges: Edge[];
  onParsed: (nodes: Node[], edges: Edge[]) => void;
}

const TextInput: React.FC<TextInputProps> = ({ edges, onParsed }) => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Update text when edges change externally
  useEffect(() => {
    setText(formatRelationText(edges));
  }, [edges]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setError(null);

    // Parse and update graph
    const result = parseRelationText(newText);
    if (result.success) {
      onParsed(result.nodes, result.edges);
    } else {
      setError(result.error || 'Unknown error');
    }
  };

  return (
    <div className="text-input-container">
      <label className="text-input-label">
        {t('textInput.label')}
      </label>
      <textarea
        className="text-input"
        value={text}
        onChange={handleTextChange}
        placeholder={t('textInput.placeholder')}
        rows={4}
      />
      {error && (
        <div className="text-input-error">
          {t('textInput.error', { message: error })}
        </div>
      )}
    </div>
  );
};

export default TextInput;
