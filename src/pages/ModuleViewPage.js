// frontend/src/pages/ModuleViewPage.js

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { api, API_URL } from '../services/api';
import GeneratingContent from '../components/GeneratingContent';
import Quiz from '../components/Quiz';
import ProgressBar from '../components/ProgressBar';
import { FaArrowLeft, FaArrowRight, FaFilePdf, FaHeadphones } from 'react-icons/fa'; // Added FaFilePdf
import { useAuth } from '../auth/AuthContext';
import { Box, Typography, Grid, Button, Paper, List, ListItem, ListItemText, ListItemIcon, useMediaQuery, useTheme } from '@mui/material';
import { FaBookOpen, FaCheckCircle } from 'react-icons/fa';

const ModuleViewPage = () => {
  const { user } = useAuth();
  const [moduleData, setModuleData] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const { moduleId } = useParams();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchModuleData = useCallback(() => {
    if (!moduleId || isNaN(parseInt(moduleId))) {
      setLoading(false); return;
    }
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

  const handleGenerateAudio = async () => {
    setIsGeneratingAudio(true);
    try {
      await api.generateModuleAudio(moduleId);
      fetchModuleData();
    } catch (error) {
      alert("Error al generar el audio.");
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      await api.downloadModulePdf(moduleId);
    } catch (error) {
      alert(`Error al descargar el PDF: ${error.message}`);
    }
  };

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

    const prev = currentIndex > 0 ? modules[currentIndex - 1] : null;
    const next = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

    const completedCount = modules.filter(m => m.status === 'completed').length;
    const progress = Math.round((completedCount / modules.length) * 100);

    const canGenerate = user.role.name === 'admin' || user.role.name === 'instructor' || user.id === course.creator_id || course.is_enrolled;
    let allowed = false;
    let incomplete = false;
    if (canGenerate) {
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

  if (loading || !course) return <Typography sx={{ textAlign: 'center', mt: 4 }}>Cargando lección...</Typography>;
  if (!moduleData) return <Typography sx={{ textAlign: 'center', mt: 4 }}>No se encontró el módulo.</Typography>;

  const canGenerate = user && (user.role.name === 'admin' || user.role.name === 'instructor' || user.id === course.creator_id || course.is_enrolled);

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={3} sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button component={Link} to={`/course/${course.id}`} startIcon={<FaArrowLeft />}>
          Volver a la currícula
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>Progreso del Curso:</Typography>
          <ProgressBar percentage={courseProgress} />
        </Box>
      </Paper>

      <Grid container spacing={3} sx={{ flexGrow: 1 }}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Módulos del curso</Typography>
            <List>
              {course.modules.map(module => (
                <ListItem 
                  button 
                  key={module.id} 
                  component={Link} 
                  to={`/module/${module.id}`}
                  selected={module.id === parseInt(moduleId)}
                >
                  <ListItemIcon>
                    {module.status === 'completed' ? <FaCheckCircle color="green" /> : <FaBookOpen />}
                  </ListItemIcon>
                  <ListItemText primary={module.title} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1" gutterBottom>{moduleData.title}</Typography>
              <Box>
              {moduleData.content_data && !moduleData.content_audio_url && (
                <Button 
                  variant="outlined" 
                  startIcon={<FaHeadphones />} 
                  onClick={handleGenerateAudio}
                  disabled={isGeneratingAudio}
                  sx={{ mr: 1 }}
                >
                  {isGeneratingAudio ? 'Generando...' : (isSmallScreen ? null : 'Escuchar Módulo')}
                </Button>
              )}
              {moduleData.content_data && (
                <Button 
                  variant="outlined" 
                  startIcon={<FaFilePdf />} 
                  onClick={handleDownloadPdf}
                >
                  {isSmallScreen ? null : 'Descargar PDF'}
                </Button>
              )}
              </Box>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>{moduleData.description}</Typography>
            
            {moduleData.content_audio_url && (
              <audio controls src={`${API_URL}/${moduleData.content_audio_url.startsWith('static') ? moduleData.content_audio_url : 'static/audio/modules/' + moduleData.content_audio_url}`} style={{ width: '100%', marginBottom: '20px' }}>
                Tu navegador no soporta el elemento de audio.
              </audio>
            )}

            {moduleData.content_data ? (
              <Box sx={{ '& img': { maxWidth: '100%', height: 'auto' } }}>
                <ReactMarkdown children={moduleData.content_data} />
              </Box>
            ) : (
              <Box sx={{ my: 4, p: 3, border: '1px dashed grey', borderRadius: 2, textAlign: 'center' }}>
                {canGenerate ? (
                  isGenerating ? <GeneratingContent /> : (
                    <>
                      {prevModuleIncomplete && <Typography color="error" sx={{ mb: 2 }}>Debes generar el contenido del módulo anterior primero.</Typography>}
                      <Button
                        variant="contained"
                        onClick={handleGenerateContent}
                        disabled={isGenerating || !isGenerationAllowed}
                      >
                        ✨ Generar Contenido con IA
                      </Button>
                    </>
                  )
                ) : (
                  <Typography variant="body1">El contenido de esta lección estará disponible pronto.</Typography>
                )}
              </Box>
            )}

            {moduleData.content_data && (
              <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #eee' }}>
                {user.role.name === 'student' ? (
                  !showQuiz ? (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" gutterBottom>Prueba tus Conocimientos</Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>Aprueba el quiz para desbloquear el siguiente módulo.</Typography>
                      <Button variant="contained" color="success" onClick={handleStartQuiz}>Realizar Quiz</Button>
                    </Box>
                  ) : (
                    quizData && <Quiz quizData={quizData} moduleId={moduleId} onQuizComplete={handleQuizCompletion} />
                  )
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>Vista Previa del Quiz</Typography>
                    <Typography variant="body1">Este es el quiz que verán los estudiantes al final de esta lección.</Typography>
                  </Box>
                )}
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid #eee' }}>
              {prevModule ? (
                <Button component={Link} to={`/module/${prevModule.id}`} startIcon={<FaArrowLeft />}>
                  Módulo Anterior
                </Button>
              ) : (
                <div />
              )}
              {nextModule && (
                <Button
                  component={Link}
                  to={`/module/${nextModule.id}`}
                  endIcon={<FaArrowRight />}
                  variant="contained"
                  disabled={moduleData.status !== 'completed'}
                >
                  Siguiente Módulo
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ModuleViewPage;