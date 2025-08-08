// frontend/src/pages/HomePage.js

import React from 'react';
import { useAuth } from '../auth/AuthContext';
import StudentDashboardPage from './StudentDashboardPage';
import AdminDashboardPage from './AdminDashboardPage';
import InstructorDashboardPage from './InstructorDashboardPage'; // Importa el nuevo dashboard

const HomePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <p>Cargando...</p>;
  }

  // Decide qué dashboard renderizar basado en el rol del usuario
  switch (user.role.name) {
    case 'student':
      return <StudentDashboardPage />;
    case 'instructor':
      return <InstructorDashboardPage />;
    case 'admin':
      return <AdminDashboardPage />;
    default:
      return <div className="page-container"><p>Bienvenido a Zeron AcademIA.</p></div>;
  }
};

export default HomePage;