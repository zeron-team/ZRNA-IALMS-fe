// frontend/src/pages/LearningPathsPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCheckCircle, FaPlusCircle, FaLightbulb, FaTools } from 'react-icons/fa';
import ThinkingIndicator from '../components/ThinkingIndicator';
import LearningPathCard from '../components/LearningPathCard';
import { Box, Typography, Container, Grid, Button, Select, MenuItem, FormControl, InputLabel, Card, CardContent } from '@mui/material';
import '../styles/InternalPageHeader.css'; // Corrected import path

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
          <Button variant="contained" onClick={() => handleEnroll(course.id)} startIcon={<FaPlusCircle />}>
            Inscribirme
          </Button>
        );
      case 'cursando':
        return (
          <Button component={Link} to={`/course/${course.id}`} variant="contained" color="success" endIcon={<FaArrowRight />}>
            Continuar Curso
          </Button>
        );
      case 'terminado':
        return (
          <Button variant="outlined" disabled startIcon={<FaCheckCircle />}>
            Terminado
          </Button>
        );
      case 'en_desarrollo':
        return (
          <Button variant="outlined" disabled startIcon={<FaTools />}>
            Próximamente
          </Button>
        );
      case 'missing':
        return (
          <Button variant="outlined" disabled startIcon={<FaLightbulb />}>
            Sugerencia IA
          </Button>
        );
      default:
        return null;
    }
  };

  const renderCourseStep = (course) => {
    return (
      <Card key={`${course.status}-${course.id}-${course.step}`} sx={{ mb: 2, p: 2 }}>
        <CardContent>
          <Typography variant="h6" component="h4" gutterBottom>
            {course.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {course.description}
          </Typography>
          <ActionButtons course={course} />
        </CardContent>
      </Card>
    );
  };

  if (loadingPaths) return <Typography sx={{ textAlign: 'center', mt: 4 }}>Cargando rutas de conocimiento...</Typography>;

  return (
    <div className="landing-container">
      <div className="internal-hero-section"> {/* Changed class name */}
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' }, fontWeight: 'bold' }}>
            Rutas de Conocimiento
          </Typography>
          <p>Descubre el camino para convertirte en un experto.</p>
        </Container>
      </div>

      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            Explora Nuestras Rutas
          </Typography>

          <Grid container spacing={4}>
            {paths.map(path => (
              <Grid item key={path.id} xs={12} sm={6} md={4}>
                <LearningPathCard path={path} />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ my: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              O Elige una Ruta Específica
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="path-select-label">-- Elige tu carrera --</InputLabel>
              <Select
                labelId="path-select-label"
                value={selectedPath ? selectedPath.id : ''}
                label="-- Elige tu carrera --"
                onChange={(e) => handleSelectPath(e.target.value)}
              >
                <MenuItem value="">-- Elige tu carrera --</MenuItem>
                {paths.map(path => (
                  <MenuItem key={path.id} value={path.id}>{path.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {loadingDetails && <ThinkingIndicator />}

          {!loadingDetails && selectedPath && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Ruta Sugerida para: {selectedPath.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {selectedPath.description}
              </Typography>
              <Grid container spacing={2}>
                {selectedPath.courses.map(course => (
                  <Grid item xs={12} key={course.id}>
                    {renderCourseStep(course)}
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Container>
      </Box>
    </div>
  );
};

export default LearningPathsPage;