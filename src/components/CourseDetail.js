// frontend/src/components/CourseDetail.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { FaCheck, FaLock } from 'react-icons/fa';
import { useAuth } from '../auth/AuthContext';
import '../styles/CourseDetail.css';

const CourseDetail = () => {
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { id } = useParams();

  const fetchDetails = useCallback(() => {
    if (!id || isNaN(parseInt(id))) {
      setLoading(false); return;
    }
    setLoading(true);
    api.getCourseDetail(id)
      .then(data => setCourse(data))
      .catch(error => console.error("Error al obtener detalles:", error))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  const handleGenerateCurriculum = async () => {
    setIsGenerating(true);
    try {
      await api.generateCurriculum(id);
      fetchDetails();
    } catch (error) {
      alert("Hubo un error al generar la currícula.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <p>Cargando detalles del curso...</p>;
  if (!course) return <p>Curso no encontrado.</p>;
  // --- LÓGICA DE PERMISOS CORREGIDA ---
  const canEdit = user && (
    user.role.name === 'admin' ||
    user.role.name === 'instructor' ||
    user.id === course.creator_id // Comprueba si el usuario es el creador
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{course.title}</h1>
        <Link to="/courses" className="btn btn-secondary">&larr; Volver al Catálogo</Link>
      </div>
      <div className="page-panel course-detail-panel">
        <p className="course-description">{course.description}</p>
        <h3 className="curriculum-header">Currícula del Curso</h3>

        {course.modules.length > 0 ? (
          <div className="curriculum-list">
            {course.modules.map(module => (
              <div key={module.id} className={`module-step ${module.status} ${module.is_locked ? 'locked' : ''}`}>
                <div className="module-step-indicator">
                  <div className="indicator-circle">
                    {module.is_locked ? <FaLock /> : (
                      module.status === 'completed' ? <FaCheck /> : <span>{String(module.order_index).padStart(2, '0')}</span>
                    )}
                  </div>
                </div>
                <div className="module-step-content">
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
        ) : (
            <div className="curriculum-generator">
              <p>Este curso aún no tiene una currícula definida.</p>
              {/* Ahora usamos la variable 'canEdit' que incluye al creador */}
              {canEdit && (
                  <button onClick={handleGenerateCurriculum} disabled={isGenerating} className="btn btn-primary">
                    {isGenerating ? 'Generando...' : '✨ Generar Currícula con IA'}
                  </button>
              )}
            </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;