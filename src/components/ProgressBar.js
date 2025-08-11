// frontend/src/components/ProgressBar.js

import React from 'react';
import '../styles/ProgressBar.css';

const ProgressBar = ({ percentage }) => {
  // Aseguramos que el porcentaje sea un número válido entre 0 y 100
  const validPercentage = Math.max(0, Math.min(100, percentage || 0));

  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar-filler"
        style={{ width: `${validPercentage}%` }}
      />
      <span className="progress-bar-label">
        {Math.round(validPercentage)}%
      </span>
    </div>
  );
};

export default ProgressBar;