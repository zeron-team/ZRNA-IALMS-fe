// frontend/src/pages/ModuleViewPage.js

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { api } from '../services/api';
import NeuralLoader from '../components/NeuralLoader';
import Quiz from '../components/Quiz';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useAuth } from '../auth/AuthContext';
import LessonHeader from '../components/LessonHeader';
import '../styles/ModuleViewPage.css'

const ModuleViewPage = () => {
  const [moduleData, setModuleData] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const { moduleId } = useParams();
  const { user } = useAuth();

  const fetchModuleData = useCallback(() => {
    setLoading(true);
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
      fetchModuleData();
    } catch (error) {
      alert("Error al generar el contenido.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartQuiz = async () => {
    try {
      // 1. Primero, verifica el estado de los intentos
      const status = await api.getQuizStatus(moduleId);

      if (!status.can_attempt) {
        alert(`Has excedido el número máximo de ${status.max_attempts} intentos para este quiz.`);
        return; // Detiene la ejecución
      }

      // 2. Si puede intentarlo, carga las preguntas del quiz
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


  const courseProgress = useMemo(() => {
    if (!course) return 0;
    const completed = course.modules.filter(m => m.status === 'completed').length;
    return Math.round((completed / course.modules.length) * 100);
  }, [course]);

  const handleQuizCompletion = (passed) => {
    if (passed) {
      // Si el quiz fue aprobado, recarga los datos para que el módulo
      // aparezca como 'completed' y se desbloquee el siguiente.
      fetchModuleData();
      setShowQuiz(false); // Opcional: Oculta el quiz y muestra un mensaje de éxito
    }
    // Si no pasa, el componente Quiz maneja los reintentos.
  };

  const { prevModule, nextModule } = useMemo(() => {
    if (!course) return {};
    const modules = course.modules || [];
    const currentIndex = modules.findIndex(m => m.id === parseInt(moduleId));
    const prev = currentIndex > 0 ? modules[currentIndex - 1] : null;
    const next = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;
    return { prevModule: prev, nextModule: next };
  }, [course, moduleId]);

  const { isGenerationAllowed, prevModuleIncomplete } = useMemo(() => {
    if (!course || !moduleData) return { isGenerationAllowed: false };
    const modules = course.modules || [];
    const currentIndex = modules.findIndex(m => m.id === moduleData.id);
    if (currentIndex === 0) return { isGenerationAllowed: true };
    const prevModule = modules[currentIndex - 1];
    const allowed = Boolean(prevModule && prevModule.content_data);
    return { isGenerationAllowed: allowed, prevModuleIncomplete: !allowed };
  }, [course, moduleData]);

  if (loading) return <div className="page-container"><NeuralLoader /></div>;
  if (!moduleData || !course) return <p>Módulo no encontrado.</p>;

  return (
      <div className="module-view-fullscreen">
        <LessonHeader
            courseTitle={course.title}
            courseId={course.id}
            courseProgress={courseProgress}
        />
        <div className="lesson-layout">
          <aside className="lesson-sidebar">
            <Link to={`/course/${course.id}`} className="back-to-curriculum">&larr; Volver a la currícula</Link>
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
            <hr/>

            {moduleData.content_data ? (
                <ReactMarkdown children={moduleData.content_data}/>
            ) : (
                <div className="content-generator">
                  {user && ['instructor', 'admin'].includes(user.role.name) ? (
                      <>
                        {isGenerating ? <NeuralLoader/> : (
                            <>
                              {prevModuleIncomplete &&
                                  <p className="warning-text">Debes generar el contenido del módulo anterior.</p>}
                              <button
                                  onClick={handleGenerateContent}
                                  disabled={isGenerating || !isGenerationAllowed}
                                  title={!isGenerationAllowed ? "Completa el módulo anterior" : "Generar contenido"}
                                  className="btn btn-primary">
                                ✨ Generar Contenido con IA
                              </button>
                            </>
                        )}
                      </>
                  ) : (
                      <p>El contenido de esta lección estará disponible pronto.</p>
                  )}
                </div>
            )}

            {/* --- SECCIÓN DEL QUIZ --- */}
            {moduleData.content_data && (
                <div className="quiz-section">
                  <hr/>
                  {!showQuiz ? (
                      <div className="start-quiz-section">
                        <h3>Prueba tus Conocimientos</h3>
                        <p>Aprueba el quiz para desbloquear el siguiente módulo.</p>
                        <button className="btn btn-success" onClick={handleStartQuiz}>
                          Realizar Quiz
                        </button>
                      </div>
                  ) : (
                      quizData && <Quiz
                          quizData={quizData}
                          moduleId={moduleId}
                          onQuizComplete={handleQuizCompletion}
                      />
                  )}
                </div>
            )}

            <div className="lesson-footer-nav">
              {prevModule ? <Link to={`/module/${prevModule.id}`} className="btn btn-secondary"><FaArrowLeft/> Módulo
                Anterior</Link> : <div></div>}
              {nextModule &&
                  <Link to={`/module/${nextModule.id}`} className="btn btn-primary" disabled={!moduleData.is_completed}>Siguiente
                    Módulo <FaArrowRight/></Link>}
            </div>
          </main>
        </div>
        </div>
        );
        };

        export default ModuleViewPage;