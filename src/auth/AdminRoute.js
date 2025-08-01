// frontend/src/auth/AdminRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // Verifica que el usuario exista y que su rol sea 'admin'
  if (!user || user.role?.name !== 'admin') {
    // Si no es admin, lo redirige a la página principal
    return <Navigate to="/" />;
  }

  // Si es admin, permite el acceso
  return children;
};

export default AdminRoute;