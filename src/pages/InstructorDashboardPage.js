// frontend/src/pages/InstructorDashboardPage.js

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/InstructorDashboardPage.css';
import { FaChalkboardTeacher, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Componente para una fila de estudiante expandible
const StudentRow = ({ student }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <tr onClick={() => setIsOpen(!isOpen)} className="student-summary-row">
                <td>
                    <span className="student-name">
                        {isOpen ? <FaChevronUp /> : <FaChevronDown />} {student.student_name}
                    </span>
                </td>
                <td>{student.enrollments.length}</td>
            </tr>
            {isOpen && (
                <tr className="student-detail-row">
                    <td colSpan="2">
                        <table className="nested-table">
                            <thead>
                                <tr>
                                    <th>Sala</th>
                                    <th>Curso</th>
                                    <th>Progreso</th>
                                </tr>
                            </thead>
                            <tbody>
                                {student.enrollments.map((enrollment, i) => (
                                    <tr key={i}>
                                        <td>{enrollment.room_name}</td>
                                        <td>{enrollment.course_title}</td>
                                        <td>{enrollment.progress}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </td>
                </tr>
            )}
        </>
    );
};

const InstructorDashboardPage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [detailedProgress, setDetailedProgress] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            api.getInstructorDashboard(),
            api.getInstructorDetailedProgress()
        ]).then(([dashboardData, progressData]) => {
            setDashboardData(dashboardData);
            setDetailedProgress(progressData);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="page-container"><p>Cargando dashboard de instructor...</p></div>;
    if (!dashboardData) return <div className="page-container"><p>No se pudieron cargar los datos.</p></div>;

    const totalRooms = dashboardData.room_summary.length;
    const totalStudents = detailedProgress.length;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Dashboard de Instructor</h1>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon rooms"><FaChalkboardTeacher /></div>
                    <div className="stat-info">
                        <h2>{totalRooms}</h2>
                        <p>Salas Creadas</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon students"><FaUsers /></div>
                    <div className="stat-info">
                        <h2>{totalStudents}</h2>
                        <p>Alumnos Totales</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid-instructor">
                <div className="page-panel">
                    <h3>Gestión de Salas</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Nombre de la Sala</th>
                                <th>Nº de Alumnos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.room_summary.map(room => (
                                <tr key={room.id}>
                                    <td>{room.name}</td>
                                    <td>{room.member_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="page-panel student-progress-panel">
                    <h3>Seguimiento Detallado de Alumnos</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Alumno</th>
                                <th>Cursos Totales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detailedProgress.map(student => (
                                <StudentRow key={student.student_id} student={student} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboardPage;