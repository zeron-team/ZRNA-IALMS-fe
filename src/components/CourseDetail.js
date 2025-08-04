// frontend/src/components/CourseDetail.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { FaCheck, FaLock } from 'react-icons/fa';
import '../styles/CourseDetail.css'; // Asegúrate de que este archivo exista y tenga los estilos del timeline

const CourseDetail = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchDetails = useCallback(() => {
    // Guarda reforzada: Solo busca si 'id' es un string numérico válido
    if (id && /^\d+$/.test(id)) {
      setLoading(true);
      api.getCourseDetail(id)
        .then(data => setCourse(data))
        .catch(error => {
          console.error("Error al obtener detalles:", error);
          setCourse(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setCourse(null);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // Vista de carga
  if (loading) {
    return <div className="page-container"><p>Cargando detalles del curso...</p></div>;
  }

  // Vista de error o si el curso no se encuentra
  if (!course) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1>Error</h1>
        </div>
        <div className="page-panel">
          <p>Curso no encontrado o el ID es inválido.</p>
          <Link to="/courses" className="btn btn-secondary">&larr; Volver al catálogo</Link>
        </div>
      </div>
    );
  }

  // Vista principal con los detalles del curso
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{course.title}</h1>
        <Link to="/courses" className="btn btn-secondary">&larr; Volver al Catálogo</Link>
      </div>
      <div className="page-panel course-detail-panel">
        <p className="course-description">{course.description}</p>

        <h3 className="curriculum-header">Currícula del Curso</h3>

        <div className="curriculum-list">
          {course.modules && course.modules.map(module => (
            <div key={module.id} className={`module-step ${module.status} ${module.is_locked ? 'locked' : ''}`}>
              <div className="module-step-indicator">
                <div className="indicator-circle">
                  {module.is_locked ? <FaLock /> : (
                    module.status === 'completed' ? <FaCheck /> : <span>{String(module.order_index).padStart(2, '0')}</span>
                  )}
                </div>
                <div className="indicator-line"></div>
              </div>
              <div className="module-step-content page-panel">
                <h4>{module.title}</h4>
                <p>{module.description}</p>
                {!module.is_locked ? (
                  <Link to={`/module/${module.id}`} className="btn btn-secondary">
                    {module.status === 'completed' ? 'Revisar Módulo' : 'Empezar Módulo'}
                  </Link>
                ) : (
                  <button className="btn btn-secondary" disabled>Bloqueado</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;