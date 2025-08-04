// frontend/src/components/Logo.js

import React from 'react';
import '../styles/Logo.css'; // Importamos sus estilos dedicados


const Logo = () => {
  const nodes = [
    { id: 1, cx: 0, cy: 40 },   // Base izquierda
    { id: 2, cx: 40, cy: 40 },  // Base derecha
    { id: 3, cx: 20, cy: 0 },   // Cima
    { id: 4, cx: 10, cy: 25 },  // Barra transversal izquierda
    { id: 5, cx: 30, cy: 25 },  // Barra transversal derecha
  ];

  const connections = [
    [1, 3], [2, 3], [4, 5]
  ];

  return (
    <div className="logo-container">
      <div className="neural-logo-animation">
        <svg className="connections-svg" viewBox="0 0 40 40">
          {connections.map(([startId, endId], i) => {
            const startNode = nodes.find(n => n.id === startId);
            const endNode = nodes.find(n => n.id === endId);
            if (!startNode || !endNode) return null;
            return (
              <line
                key={i}
                x1={startNode.cx} y1={startNode.cy}
                x2={endNode.cx} y2={endNode.cy}
                className="connection"
                style={{ animationDelay: `${i * 0.8}s` }}
              />
            );
          })}
        </svg>
        {nodes.map((node, i) => (
        <div
          key={node.id}
          className="node"
          style={{
            // Se resta la mitad del nuevo tamaño (5px / 2 = 2.5px)
            top: `${node.cy - 2.5}px`,
            left: `${node.cx - 2.5}px`,
            animationDelay: `${i * 0.5}s`
          }}
        ></div>
      ))}
      </div>
      <span className="logo-text">Zeron Academy</span>
    </div>
  );
};

export default Logo;