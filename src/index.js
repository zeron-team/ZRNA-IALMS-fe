import React from 'react';
import ReactDOM from 'react-dom/client';

// 1. Importa los estilos de la librería PRIMERO
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 2. Luego, importa tus estilos globales
import './styles/global.css';
import './styles/utilities.css';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);