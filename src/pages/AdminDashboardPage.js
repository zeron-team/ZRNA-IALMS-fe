// frontend/src/pages/AdminDashboardPage.js

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FaUsers, FaBook, FaUserCheck, FaLayerGroup, FaChalkboard } from 'react-icons/fa';
import '../styles/AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [roomsSummary, setRoomsSummary] = useState([]); // <-- Nuevo estado
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getDashboardStats(),
      api.getDetailedEnrollments(),
      api.getAllRoomsSummary() // <-- Nueva llamada a la API
    ])
    .then(([statsData, enrollmentsData, roomsData]) => {
      setStats(statsData);
      setEnrollments(enrollmentsData);
      setRoomsSummary(roomsData); // <-- Guarda los datos
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
              <div className="stat-card">
                <div className="stat-icon rooms"><FaChalkboard/></div>
                <div className="stat-info">
                  <h2>{roomsSummary.length}</h2>
                  <p>Salas Totales</p>
                </div>
              </div>
            </>
        )}
      </div>
      {/* --- NUEVO PANEL DE SUPERVISIÓN DE SALAS --- */}
      <div className="page-panel rooms-summary-panel">
        <h2>Supervisión de Salas</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre de la Sala</th>
              <th>Instructor</th>
              <th>Cursos en la Sala</th>
              <th>Alumnos en la Sala</th>
            </tr>
          </thead>
          <tbody>
            {roomsSummary.map(room => (
              <tr key={room.id}>
                <td>{room.name}</td>
                <td>{room.instructor_name}</td>
                <td>{room.course_count}</td>
                <td>{room.member_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
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