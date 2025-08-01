// frontend/src/components/NeuralLoader.js

import React from 'react';

const NeuralLoader = () => {
  return (
    <div className="neural-loader" aria-label="La IA está generando el contenido...">
      <div className="node"></div>
      <div className="node"></div>
      <div className="node"></div>
      <div className="node"></div>
      <div className="node"></div>
    </div>
  );
};

export default NeuralLoader;