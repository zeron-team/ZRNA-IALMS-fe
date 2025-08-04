// frontend/src/pages/StudentDashboardPage.js

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import StarRating from '../components/StarRating';
import { FaLightbulb } from 'react-icons/fa';
import '../styles/StudentDashboard.css';

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({ enrolled_courses: [], recommended_courses: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getStudentDashboard()
      .then(setDashboardData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando tu dashboard...</p>;

  return (
    <div className="page-container">
      <div className="page-header dashboard-header">
        <h1>Hola, {user.profile?.first_name || user.username}</h1>
        <p>¡Es un buen día para aprender algo nuevo!</p>
      </div>

      <div className="dashboard-grid">
        {/* --- Columna Principal: Cursos en Progreso --- */}
        <div className="dashboard-main-column">
          <section className="dashboard-section">
            <h2>Mis Cursos en Progreso</h2>
            {dashboardData.enrolled_courses.length > 0 ? (
              dashboardData.enrolled_courses.map(course => (
                <div key={course.id} className="progress-course-card" onClick={() => navigate(`/course/${course.id}`)}>
                  <StarRating total={course.total_stars} earned={course.earned_stars} />
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <ProgressBar percentage={course.completion_percentage} />
                </div>
              ))
            ) : (
              <div className="page-panel">
                <p>Aún no te has inscrito a ningún curso. ¡Explora la <a href="/courses">galería de cursos</a> para empezar!</p>
              </div>
            )}
          </section>
        </div>

        {/* --- Columna Lateral: Recomendaciones de la IA --- */}
        <div className="dashboard-side-column">
          <section className="dashboard-section">
            <h2>Recomendado para Ti</h2>
            {dashboardData.recommended_courses.length > 0 ? (
              dashboardData.recommended_courses.map(course => (
                 <div key={course.id} className="recommendation-card" onClick={() => navigate(`/course/${course.id}`)}>
                  <h3><FaLightbulb /> {course.title}</h3>
                  <p>{course.description}</p>
                </div>
              ))
            ) : (
              <p>Completa algunos cursos para recibir recomendaciones personalizadas.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;