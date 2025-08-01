// frontend/src/pages/HomePage.js

import React from 'react';
import { useAuth } from '../auth/AuthContext';
import StudentDashboardPage from './StudentDashboardPage';
import CourseList from '../components/CourseList';
import '../styles/utilities.css';

const HomePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <p>Cargando...</p>;
  }

  if (user.role.name === 'student') {
    return <StudentDashboardPage />;
  } else {
    return <CourseList />;
  }
};

export default HomePage;