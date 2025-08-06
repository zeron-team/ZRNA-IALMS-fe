// frontend/src/pages/ModuleViewPage.js

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { api } from '../services/api';
import NeuralLoader from '../components/NeuralLoader';
import Quiz from '../components/Quiz';
import ProgressBar from '../components/ProgressBar';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../auth/AuthContext';
import '../styles/ModuleViewPage.css';

const ModuleViewPage = () => {
  const { user } = useAuth();
  const [moduleData, setModuleData] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const { moduleId } = useParams();

  const fetchModuleData = useCallback(() => {
    if (!moduleId || isNaN(parseInt(moduleId))) {
      setLoading(false); return;
    }
    setLoading(true);
    // Hacemos las llamadas en paralelo para más eficiencia
    Promise.all([
      api.getModuleDetail(moduleId),
      api.getModuleDetail(moduleId).then(mod => api.getCourseDetail(mod.course_id))
    ]).then(([moduleDetails, courseDetails]) => {
      setModuleData(moduleDetails);
      setCourse(courseDetails);
    }).catch(console.error).finally(() => setLoading(false));
  }, [moduleId]);

  useEffect(() => {
    fetchModuleData();
  }, [fetchModuleData]);

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    try {
      await api.generateModuleContent(moduleId);
      fetchModuleData(); // Recarga los datos para mostrar el nuevo contenido
    } catch (error) {
      alert("Error al generar el contenido.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartQuiz = async () => {
    try {
      const status = await api.getQuizStatus(moduleId);
      if (!status.can_attempt) {
        alert(`Has excedido el número máximo de ${status.max_attempts} intentos.`);
        return;
      }
      const data = await api.getQuizForModule(moduleId);
      if (data && data.questions && data.questions.length > 0) {
        setQuizData(data);
        setShowQuiz(true);
      } else {
        alert('Aún no hay un quiz disponible para este módulo.');
      }
    } catch (error) {
      alert(`Error al iniciar el quiz: ${error.message}`);
    }
  };

  const handleQuizCompletion = (passed) => {
    if (passed) {
      fetchModuleData();
      setShowQuiz(false);
    }
  };

  // Hook unificado para calcular todos los valores derivados
  const {
    prevModule,
    nextModule,
    courseProgress,
    isGenerationAllowed,
    prevModuleIncomplete
  } = useMemo(() => {
    if (!course || !moduleData || !user) {
      return {};
    }
    const modules = course.modules || [];
    const currentIndex = modules.findIndex(m => m.id === parseInt(moduleId));

    // Navegación
    const prev = currentIndex > 0 ? modules[currentIndex - 1] : null;
    const next = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

    // Progreso del curso
    const completedCount = modules.filter(m => m.status === 'completed').length;
    const progress = Math.round((completedCount / modules.length) * 100);

    // Permisos de generación
    const canEdit = user.role.name === 'admin' || user.role.name === 'instructor' || user.id === course.creator_id;
    let allowed = false;
    let incomplete = false;
    if (canEdit) {
      if (currentIndex === 0) {
        allowed = true;
      } else if (prev && prev.content_data) {
        allowed = true;
      } else {
        incomplete = true;
      }
    }

    return {
      prevModule: prev,
      nextModule: next,
      courseProgress: progress,
      isGenerationAllowed: allowed,
      prevModuleIncomplete: incomplete
    };
  }, [course, moduleData, user, moduleId]);

  // Vistas de carga y error
  if (loading || !course) return <div className="page-container"><p>Cargando lección...</p></div>;
  if (!moduleData) return <div className="page-container"><p>No se encontró el módulo.</p></div>;

  const canEdit = user && (user.role.name === 'admin' || user.role.name === 'instructor' || user.id === course.creator_id);

  return (
    <div className="lesson-view-container">
      <header className="lesson-header">
        <Link to={`/course/${course.id}`} className="back-link">
          <FaArrowLeft /> Volver a la currícula
        </Link>
        <div className="lesson-progress">
          <span>Progreso del Curso</span>
          <ProgressBar percentage={courseProgress} />
        </div>
        {/* <div className="course-title-header">{course.title}</div> */}
      </header>

      <div className="lesson-layout">
        <aside className="lesson-sidebar">
          <h4>Módulos del curso</h4>
          <nav className="lesson-nav">
            <ul>
              {course.modules.map(module => (
                <li key={module.id}>
                  <Link to={`/module/${module.id}`} className={module.id === parseInt(moduleId) ? 'active' : ''}>
                    {module.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="lesson-content">
          <h1>{moduleData.title}</h1>
          <p className="lesson-description">{moduleData.description}</p>
          <hr />

          {moduleData.content_data ? (
            <ReactMarkdown children={moduleData.content_data} />
          ) : (
            <div className="content-generator">
              {canEdit ? (
                isGenerating ? <NeuralLoader /> : (
                  <>
                    {prevModuleIncomplete && <p className="warning-text">Debes generar el contenido del módulo anterior primero.</p>}
                    <button
                      onClick={handleGenerateContent}
                      disabled={isGenerating || !isGenerationAllowed}
                      className="btn btn-primary"
                    >
                      ✨ Generar Contenido con IA
                    </button>
                  </>
                )
              ) : (
                <p>El contenido de esta lección estará disponible pronto.</p>
              )}
            </div>
          )}

          {moduleData.content_data && user.role.name === 'student' && (
            <div className="quiz-section">
              <hr />
              {!showQuiz ? (
                <div className="start-quiz-section">
                  <h3>Prueba tus Conocimientos</h3>
                  <p>Aprueba el quiz para desbloquear el siguiente módulo.</p>
                  <button className="btn btn-success" onClick={handleStartQuiz}>Realizar Quiz</button>
                </div>
              ) : (
                quizData && <Quiz quizData={quizData} moduleId={moduleId} onQuizComplete={handleQuizCompletion} />
              )}
            </div>
          )}

          <div className="lesson-footer-nav">
            {prevModule ? <Link to={`/module/${prevModule.id}`} className="btn btn-secondary"><FaArrowLeft/> Módulo Anterior</Link> : <div></div>}
            {nextModule && (
              <Link
                to={`/module/${nextModule.id}`}
                className={`btn btn-primary ${moduleData.status !== 'completed' ? 'disabled' : ''}`}
              >
                Siguiente Módulo <FaArrowRight/>
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModuleViewPage;