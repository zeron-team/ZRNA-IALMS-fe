// frontend/src/pages/AdminDashboardPage.js

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FaUsers, FaBook, FaUserCheck, FaLayerGroup, FaChalkboard, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../styles/AdminDashboardPage.css';

// --- Nuevo Componente para la Fila del Curso (con lógica de despliegue) ---
const CourseRow = ({ course }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <tr onClick={() => setIsOpen(!isOpen)} className="course-summary-row">
                <td>
                    <span className="course-title">
                        {isOpen ? <FaChevronUp /> : <FaChevronDown />} {course.title}
                    </span>
                </td>
                <td>{course.enrolled_students.length}</td>
            </tr>
            {isOpen && (
                <tr className="course-detail-row">
                    <td colSpan="2">
                        <div className="nested-table-container">
                            <table className="nested-table">
                                <thead>
                                    <tr>
                                        <th>Alumno</th>
                                        <th>Email</th>
                                        <th>Progreso</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {course.enrolled_students.map(student => (
                                        <tr key={student.id}>
                                            <td>{student.name}</td>
                                            <td>{student.email}</td>
                                            <td>{student.progress}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [roomsSummary, setRoomsSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getDashboardStats(),
      api.getEnrollmentsWithProgress(), // <-- Se llama al endpoint detallado
      api.getAllRoomsSummary()
    ])
    .then(([statsData, enrollmentsData, roomsData]) => {
      setStats(statsData);
      setEnrollments(enrollmentsData);
      setRoomsSummary(roomsData);
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

          {/* --- Tarjetas de Estadísticas (KPIs) --- */}
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
                          <div className="stat-icon courses"><FaBook/></div>
                          <div className="stat-info">
                              <h2>{stats.total_courses}</h2>
                              <p>Cursos Totales</p>
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

          {/* --- Panel de Supervisión de Salas --- */}
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
              <table className="data-table">
                  <thead>
                  <tr>
                      <th>Título del Curso</th>
                      <th>Cantidad de Inscritos</th>
                  </tr>
                  </thead>
                  <tbody>
                  {enrollments.map(course => (
                      <CourseRow key={course.id} course={course}/>
                  ))}
                  </tbody>
              </table>
          </div>
      </div>
  );
};

export default AdminDashboardPage;