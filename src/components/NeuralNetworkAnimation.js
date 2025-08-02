//frontend/src/components/NeuralNetworkAnimation.js

import React from 'react';
import '../styles/NeuralNetworkAnimation.css';

const NeuralNetworkAnimation = () => {
  // Coordenadas de las neuronas en estructura piramidal
  const nodes = [
    // Base (4 nodos)
    { id: 1, cx: 50, cy: 250 }, { id: 2, cx: 150, cy: 250 },
    { id: 3, cx: 250, cy: 250 }, { id: 4, cx: 350, cy: 250 },
    // Capa 2 (3 nodos)
    { id: 5, cx: 100, cy: 180 }, { id: 6, cx: 200, cy: 180 }, { id: 7, cx: 300, cy: 180 },
    // Capa 3 (2 nodos)
    { id: 8, cx: 150, cy: 110 }, { id: 9, cx: 250, cy: 110 },
    // Cima (1 nodo)
    { id: 10, cx: 200, cy: 40 }
  ];

  // Conexiones lógicas entre capas
  const connections = [
    [1, 5], [2, 5], [2, 6], [3, 6], [3, 7], [4, 7],
    [5, 8], [6, 8], [6, 9], [7, 9],
    [8, 10], [9, 10]
  ];

  return (
    <div className="neural-network-container">
      <svg className="connections-svg" viewBox="0 0 400 300">
        {connections.map(([startId, endId], i) => {
          const startNode = nodes.find(n => n.id === startId);
          const endNode = nodes.find(n => n.id === endId);
          if (!startNode || !endNode) return null;
          return (
            <line
              key={i} x1={startNode.cx} y1={startNode.cy}
              x2={endNode.cx} y2={endNode.cy}
              className="connection" style={{ animationDelay: `${i * 0.2}s` }}
            />
          );
        })}
      </svg>
      {nodes.map((node, i) => (
        <div key={node.id} className="node" style={{
            top: `${node.cy - 7.5}px`, left: `${node.cx - 7.5}px`,
            animationDelay: `${i * 0.15}s`
          }}>
        </div>
      ))}
    </div>
  );
};

export default NeuralNetworkAnimation;