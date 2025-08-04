// frontend/src/pages/AdminDashboardPage.js

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FaUsers, FaBook, FaUserCheck, FaLayerGroup } from 'react-icons/fa';
import '../styles/AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getDashboardStats(),
      api.getDetailedEnrollments()
    ])
    .then(([statsData, enrollmentsData]) => {
      setStats(statsData);
      setEnrollments(enrollmentsData);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando dashboard...</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard de Administración</h1>
      </div>

      {/* --- Tarjetas de Estadísticas --- */}
      <div className="admin-dashboard-grid">
        {stats && (
            <>
              <div className="stat-card">
                <div className="stat-icon users"><FaUsers/></div>
                <div className="stat-info">
                  <h2>{stats.total_users}</h2>
                  <p>Usuarios Totales</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon enrollments"><FaUserCheck/></div>
                <div className="stat-info">
                  <h2>{stats.total_enrollments}</h2>
                  <p>Inscripciones Totales</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon courses"><FaBook/></div>
                <div className="stat-info">
                  <h2>{stats.total_courses}</h2>
                  <p>Cursos Totales</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon categories"><FaLayerGroup/></div>
                <div className="stat-info">
                  <h2>{stats.total_categories}</h2>
                  <p>Categorías Totales</p>
                </div>
              </div>
            </>
        )}
      </div>

      {/* --- Panel de Inscripciones por Curso --- */}
      <div className="page-panel enrollment-panel">
        <h2>Inscripciones por Curso</h2>
        <table className="enrollment-table">
          <thead>
          <tr>
            <th>Título del Curso</th>
              <th>Cantidad de Inscritos</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map(course => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.enrollment_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardPage;