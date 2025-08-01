/* frontend/src/auth/  */

import React from 'react';
import { Navigate } from 'react-router-dom';
// Asegúrate de que AuthContext se importe correctamente si lo usas aquí.
// import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  // Lógica de autenticación simplificada
  const isAuthenticated = true; // Reemplazar con la lógica real del Context

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;