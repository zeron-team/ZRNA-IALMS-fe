// frontend/src/pages/StudentDashboardPage.js

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { Box, Typography, Grid, Container, Paper, Link as MuiLink, Card } from '@mui/material';
import { FaLightbulb } from 'react-icons/fa';
import '../styles/InternalPageHeader.css'; // Corrected import path

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({ enrolled_courses: [], recommended_courses: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getStudentDashboard()
      .then(setDashboardData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Typography sx={{ textAlign: 'center', mt: 4 }}>Cargando tu dashboard...</Typography>;
  }

  return (
    <div className="landing-container">
      <div className="internal-hero-section"> {/* Changed class name */}
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' }, fontWeight: 'bold' }}>
            Hola, {user.profile?.first_name || user.username}
          </Typography>
          <p>¡Es un buen día para aprender algo nuevo!</p>
        </Container>
      </div>

      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* --- Columna Principal: Cursos en Progreso --- */}
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Mis Cursos en Progreso
              </Typography>
              {dashboardData.enrolled_courses.length > 0 ? (
                <Grid container spacing={4}>
                  {dashboardData.enrolled_courses.map(course => (
                    <Grid item key={course.id} xs={12} sm={6} md={6}>
                      <CourseCard course={course} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper sx={{ p: 3, textAlign: 'center', mt: 4 }}>
                  <Typography variant="h6">
                    Aún no te has inscrito a ningún curso.
                  </Typography>
                  <Typography>
                    ¡Explora la <MuiLink href="/courses">galería de cursos</MuiLink> para empezar!
                  </Typography>
                </Paper>
              )}
            </Grid>

            {/* --- Columna Lateral: Recomendaciones de la IA --- */}
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3, bgcolor: 'grey.100', borderRadius: 2 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  <FaLightbulb /> Recomendado para Ti
                </Typography>
                {dashboardData.recommended_courses.length > 0 ? (
                  <Grid container spacing={2}>
                    {dashboardData.recommended_courses.map(course => (
                      <Grid item key={course.id} xs={12}>
                        <Card 
                          sx={{ 
                            mb: 2, 
                            p: 2, 
                            cursor: 'pointer', 
                            transition: '0.2s',
                            background: 'linear-gradient(135deg, var(--sidebar-bg) 0%, #34495e 100%)',
                            color: 'white',
                            '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
                          }} 
                          onClick={() => navigate(`/course/${course.id}`)}
                        >
                          <Typography variant="h6" component="h3" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#ecf0f1' }}>
                            {course.title}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>{course.description}</Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography>Completa algunos cursos para recibir recomendaciones personalizadas.</Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default StudentDashboardPage;