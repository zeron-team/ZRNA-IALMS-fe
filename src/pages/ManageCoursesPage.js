// frontend/src/pages/ManageCoursesPage.js

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom'; // 1. Importa useNavigate
import CourseFormModal from '../components/CourseFormModal';
import '../styles/AdminPages.css';

const ManageCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate(); // 2. Inicializa useNavigate

  const fetchMyCourses = () => {
    setLoading(true);
    api.getMyTaughtCourses()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const handleCreate = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  // 3. Nueva función para ir al detalle del curso
  const handleManage = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleSave = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
    fetchMyCourses();
  };

  const handleDelete = async (courseId, courseTitle) => {
    if (window.confirm(`¿Seguro que quieres eliminar el curso "${courseTitle}"?`)) {
      await api.deleteCourse(courseId);
      fetchMyCourses();
    }
  };

  if (loading) return <p>Cargando tus cursos...</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Administrar Cursos</h1>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Crear Nuevo Curso
        </button>
      </div>

      <div className="page-panel">
        <table className="courses-table">
          <thead>
            <tr>
              <th>Título del Curso</th>
              <th>Descripción</th>
              <th style={{ width: '250px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td className="actions-cell">
                  {/* 4. Nuevo Botón "Gestionar" */}
                  <button onClick={() => handleManage(course.id)} className="btn btn-success">Gestionar</button>
                  <button onClick={() => handleEdit(course)} className="btn btn-secondary">Editar</button>
                  <button onClick={() => handleDelete(course.id, course.title)} className="btn btn-danger delete">Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <CourseFormModal
          course={selectedCourse}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ManageCoursesPage;