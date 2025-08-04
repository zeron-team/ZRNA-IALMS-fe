// frontend/src/pages/HomePage.js

import React from 'react';
import { useAuth } from '../auth/AuthContext';
import StudentDashboardPage from './StudentDashboardPage';
import AdminDashboardPage from './AdminDashboardPage'; // <-- Importa el dashboard de admin

const HomePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <p>Cargando...</p>;
  }

  // --- LÓGICA DE ROLES ---
  // Si es estudiante, muestra su dashboard.
  // Si es instructor o admin, muestra el dashboard de admin.
  if (user.role.name === 'student') {
    return <StudentDashboardPage />;
  } else if (user.role.name === 'instructor' || user.role.name === 'admin') {
    return <AdminDashboardPage />;
  }

  // Fallback por si hay un rol desconocido
  return <p>Bienvenido a Zeron Academy.</p>;
};

export default HomePage;