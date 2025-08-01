// frontend/src/components/SummaryModal.js

import React from 'react';
import ReactMarkdown from 'react-markdown';
import ThinkingIndicator from './ThinkingIndicator';

const SummaryModal = ({ title, content, isLoading, onClose }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        <hr />
        {isLoading ? (
          <ThinkingIndicator />
        ) : (
          <ReactMarkdown children={content} />
        )}
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;