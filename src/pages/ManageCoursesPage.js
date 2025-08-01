// frontend/src/pages/ManageCoursesPage.js

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import CourseFormModal from '../components/CourseFormModal';
import '../styles/AdminPages.css'

const ManageCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchMyCourses = () => {
    setLoading(true);
    // CORRECCIÓN: Llama a 'getMyTaughtCourses' en lugar de 'getMyCourses'
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
        <button className="btn btn-success" onClick={handleCreate}>
          + Crear Nuevo Curso
        </button>
      </div>

      <div className="page-panel">
        <table className="courses-table">
          <thead>
            <tr>
              <th>Título del Curso</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => ( // La variable aquí es 'course'
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td className="actions-cell">
                   {/* CORRECCIÓN: Usa 'course' en lugar de 'item' */}
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