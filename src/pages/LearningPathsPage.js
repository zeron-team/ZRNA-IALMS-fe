// frontend/src/pages/LearningPathsPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCheckCircle, FaPlusCircle, FaLightbulb, FaTools } from 'react-icons/fa';
import ThinkingIndicator from '../components/ThinkingIndicator';
import '../styles/LearningPathsPage.css';

const LearningPathsPage = () => {
  const [paths, setPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [loadingPaths, setLoadingPaths] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchPaths = useCallback(() => {
    api.getLearningPaths()
      .then(setPaths)
      .catch(console.error)
      .finally(() => setLoadingPaths(false));
  }, []);

  useEffect(() => {
    fetchPaths();
  }, [fetchPaths]);

  const handleSelectPath = useCallback((pathId) => {
    if (!pathId) {
      setSelectedPath(null);
      return;
    }
    setLoadingDetails(true);
    api.getLearningPathDetail(pathId)
      .then(setSelectedPath)
      .catch(console.error)
      .finally(() => setLoadingDetails(false));
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await api.enrollInCourse(courseId);
      alert('¡Inscripción exitosa!');
      if (selectedPath) {
        handleSelectPath(selectedPath.id);
      }
    } catch (error) {
      alert(`Error al inscribirte: ${error.message}`);
    }
  };

  // Sub-componente para renderizar los botones de acción y mantener el código limpio
  const ActionButtons = ({ course }) => {
    switch (course.user_status) {
      case 'no_inscrito':
        return (
          <>
            <button className="btn btn-secondary" onClick={() => alert('Resumen del curso pendiente.')}>Ver Resumen</button>
            <button className="btn btn-primary" onClick={() => handleEnroll(course.id)}>
              <FaPlusCircle /> Inscribirme
            </button>
          </>
        );
      case 'cursando':
        return (
          <Link to={`/course/${course.id}`} className="btn btn-success">
            Continuar Curso <FaArrowRight />
          </Link>
        );
      case 'terminado':
        return (
          <div className="status-badge completed"><FaCheckCircle /> Terminado</div>
        );
      case 'en_desarrollo':
        return (
          <button className="btn btn-secondary" disabled>
            <FaTools style={{marginRight: '8px'}} /> Próximamente
          </button>
        );
      case 'missing':
        return (
          <button className="btn btn-primary" disabled>
            <FaLightbulb style={{marginRight: '8px'}} /> Sugerencia IA
          </button>
        );
      default:
        return null;
    }
  };

  const renderCourseStep = (course) => {
    const stepClass = `timeline-step status-${course.user_status}`;

    return (
      <div key={`${course.status}-${course.id}-${course.step}`} className={stepClass}>
        <div className="timeline-indicator">
          <div className="indicator-circle">
            {course.user_status === 'terminado' ? <FaCheckCircle /> : <span>{String(course.step).padStart(2, '0')}</span>}
          </div>
          <div className="indicator-line"></div>
        </div>
        <div className="timeline-content page-panel">
          <h4>{course.title}</h4>
          <p>{course.description}</p>
        <div className="step-actions">
          <ActionButtons course={course} />
        </div>
      </div>
    </div>
  );
  };

  if (loadingPaths) return <p>Cargando rutas de conocimiento...</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Rutas de Conocimiento</h1>
      </div>
      <div className="page-panel">
        <p>Selecciona una carrera para ver la ruta de cursos recomendada para convertirte en un experto.</p>
        <select onChange={(e) => handleSelectPath(e.target.value)} className="path-selector">
          <option value="">-- Elige tu carrera --</option>
          {paths.map(path => (
            <option key={path.id} value={path.id}>{path.title}</option>
          ))}
        </select>
      </div>

      {loadingDetails && <ThinkingIndicator />}

      {!loadingDetails && selectedPath && (
        <div className="curriculum-list">
          <h2>Ruta Sugerida para: {selectedPath.title}</h2>
          <p>{selectedPath.description}</p>
          {selectedPath.courses.map(course => renderCourseStep(course))}
        </div>
      )}
    </div>
  );
};

export default LearningPathsPage;