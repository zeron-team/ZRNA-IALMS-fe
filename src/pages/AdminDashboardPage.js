// frontend/src/pages/AdminDashboardPage.js

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';


const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getDashboardStats(),
      api.getDetailedEnrollments()
    ]).then(([statsData, enrollmentsData]) => {
      setStats(statsData);
      setEnrollments(enrollmentsData);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando dashboard...</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard de Administración</h1>
      </div>

      {/* --- Tarjetas de Estadísticas --- */}
      <div className="stats-cards">
        <div className="stat-card"><h2>{stats?.total_users}</h2><p>Usuarios Totales</p></div>
        <div className="stat-card"><h2>{stats?.total_courses}</h2><p>Cursos Totales</p></div>
        <div className="stat-card"><h2>{stats?.total_enrollments}</h2><p>Inscripciones Totales</p></div>
      </div>

      {/* --- Lista Detallada de Inscripciones --- */}
      <div className="page-panel">
        <h2>Inscripciones por Curso</h2>
        {enrollments.map(course => (
          <div key={course.id} className="course-enrollment-section">
            <h3>{course.title} ({course.enrolled_students.length} inscritos)</h3>
            <ul>
              {course.enrolled_students.map(student => (
                <li key={student.id}>{student.username} ({student.email})</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;