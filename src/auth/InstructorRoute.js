import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const InstructorRoute = ({ children }) => {
  const { user } = useAuth();

  // Define los roles que tienen permiso para acceder a estas rutas
  const allowedRoles = ['instructor', 'admin'];

  // 1. Verifica que el usuario exista.
  // 2. Verifica que el nombre del rol del usuario esté en la lista de roles permitidos.
  if (!user || !allowedRoles.includes(user.role?.name)) {
    // Si no tiene permiso, lo redirige a la página principal.
    return <Navigate to="/" />;
  }

  // Si tiene permiso, muestra la página solicitada.
  return children;
};

export default InstructorRoute;