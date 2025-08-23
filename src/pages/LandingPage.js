// frontend/src/pages/LandingPage.js

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  FaBrain,
  FaChalkboardTeacher,
  FaPlusCircle,
  FaCheck,
  FaTimes,
  FaUserGraduate,
} from 'react-icons/fa';
import CourseCard from '../components/CourseCard';
import { Box, Typography, Button, Container, Grid, Card, Drawer, Chip, Stack, IconButton } from '@mui/material';
import { FaFilter } from 'react-icons/fa';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const [categories, setCategories] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [activePlanFilter, setActivePlanFilter] = useState('Estudiante');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);

  useEffect(() => {
    setLoadingCourses(true); // Set to true before fetch
    Promise.all([
      api.getCategories(),
      api.getCourses()
    ]).then(([categoryData, courseData]) => {
      setCategories(categoryData);
      setAllCourses(courseData);
      console.log("Category Data Received:", categoryData); // Add this line
    }).catch(console.error)
      .finally(() => {
        setLoadingCourses(false); // Set to false after fetch (success or error)
      });
  }, []);

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleLevelSelect = (level) => {
    setSelectedLevel(prev => prev === level ? null : level);
  };

  const handlePriceSelect = (priceType) => {
    setSelectedPrice(prev => prev === priceType ? null : priceType);
  };

  const clearFilters = () => {
    setSelectedLevel(null);
    setSelectedCategories([]);
    setSelectedPrice(null);
  };

  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      const levelMatch = selectedLevel ? course.level === selectedLevel : true;
      const categoryMatch = selectedCategories.length > 0 ? selectedCategories.includes(course.category.id) : true;
      const priceMatch = selectedPrice
        ? (selectedPrice === 'free' ? course.price === 0 : course.price > 0)
        : true;
      return levelMatch && categoryMatch && priceMatch;
    });
  }, [allCourses, selectedLevel, selectedCategories, selectedPrice]);

  const renderFilters = () => (
    <div className="filters-section" style={{ overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h3">Filtros</Typography>
        <IconButton onClick={() => setMobileFiltersOpen(false)} aria-label="close filters">
          <FaTimes />
        </IconButton>
      </Box>
      
      <Box mb={2}>
        <Typography variant="subtitle1">Tipo</Typography>
        <Stack direction="row" spacing={1}>
          <Chip 
            label="Gratis"
            onClick={() => handlePriceSelect('free')}
            color={selectedPrice === 'free' ? 'primary' : 'default'}
            clickable
          />
          <Chip 
            label="Pago"
            onClick={() => handlePriceSelect('paid')}
            color={selectedPrice === 'paid' ? 'primary' : 'default'}
            clickable
          />
        </Stack>
      </Box>

      <Box mb={2}>
        <Typography variant="subtitle1">Nivel</Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {['basico', 'intermedio', 'avanzado'].map(level => (
            <Chip 
              key={level}
              label={level.charAt(0).toUpperCase() + level.slice(1)}
              onClick={() => handleLevelSelect(level)}
              color={selectedLevel === level ? 'primary' : 'default'}
              clickable
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
      </Box>

      <Box mb={2}>
        <Typography variant="subtitle1">Categorías</Typography>
        {categories.length > 0 ? (
          <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }} sx={{ flexWrap: 'wrap', width: '100%' }}>
            {categories.map(category => (
              <Chip
                key={category.id}
                label={category.name}
                onClick={() => handleCategoryToggle(category.id)}
                color={selectedCategories.includes(category.id) ? 'primary' : 'default'}
                clickable
                size="small" // Added size="small"
                sx={{ mb: 1, display: 'inline-flex', backgroundColor: 'purple', color: 'white' }}
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">Cargando categorías o no hay categorías disponibles.</Typography>
        )}
      </Box>

      <Button onClick={() => { clearFilters(); setMobileFiltersOpen(false); }} variant="outlined">Limpiar Filtros</Button>
    </div>
  );

  return (
      <div className="landing-container">
        <div className="hero-section">
          <Container maxWidth="md" sx={{ px: { xs: 0, sm: 2, md: 3 } }}>
            <h1>
              El Futuro del Aprendizaje es Impulsado por IA
            </h1>
            <p>
              Descubre una nueva forma de aprender con nuestra plataforma inteligente.
            </p>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              className="cta-button"
            >
              Comienza tu Aventura
            </Button>
          </Container>
        </div>

        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Container maxWidth="md" sx={{ px: { xs: 0, sm: 2, md: 3 } }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{fontWeight: 'bold'}}>
              Una Plataforma, Infinitas Posibilidades
            </Typography>
            <Grid container spacing={4} justifyContent="center" sx={{mt: 4}} alignItems="stretch">
              <Grid item xs={12} sm={6} md={3}>
                <Card className="feature-card" sx={{ height: '100%' }}>
                    <FaUserGraduate size={40} color="#2196F3" />
                    <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1, textAlign: 'center', fontWeight: 'bold'}}>
                      Comienza a Estudiar
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center'}}>
                      Inicia tu viaje de aprendizaje con cursos personalizados y contenido generado por IA.
                    </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card className="feature-card" sx={{ height: '100%' }}>
                    <FaPlusCircle size={40} color="#2196F3" />
                    <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1, textAlign: 'center', fontWeight: 'bold'}}>
                      Crea Tus Propios Cursos
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center'}}>
                      Como estudiante, tienes el poder de crear hasta dos cursos y compartirlos.
                    </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card className="feature-card" sx={{ height: '100%' }}>
                    <FaChalkboardTeacher size={40} color="#2196F3" />
                    <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1, textAlign: 'center', fontWeight: 'bold'}}>
                      Gestiona Salas Privadas
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center'}}>
                      Como instructor, puedes crear salas exclusivas, añadir cursos y gestionar a tus alumnos.
                    </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card className="feature-card" sx={{ height: '100%' }}>
                    <FaBrain size={40} color="#0D47A1" />
                    <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1, textAlign: 'center', fontWeight: 'bold'}}>
                      Contenido Generado por IA
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center'}}>
                      Guía a nuestra IA con tu propio material para generar currículas y lecciones personalizadas.
                    </Typography>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <section className="pricing-section">
                      <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2, md: 3 } }}>
            <h2>
              Un Plan para Cada Miembro de Nuestra Comunidad
            </h2>
            <p className="section-subtitle">
              Elige el camino que mejor se adapte a tus objetivos, ya sea para aprender o para enseñar.
            </p>

            <div className="role-filter-container">
                <div className={`role-filter-card ${activePlanFilter === 'Estudiante' ? 'active' : ''}`} onClick={() => setActivePlanFilter('Estudiante')}>
                    <FaUserGraduate size={30} />
                    <h3>Planes para Estudiantes</h3>
                </div>
                <div className={`role-filter-card ${activePlanFilter === 'Instructor' ? 'active' : ''}`} onClick={() => setActivePlanFilter('Instructor')}>
                    <FaChalkboardTeacher size={30} />
                    <h3>Planes para Instructores</h3>
                </div>
            </div>

            <div className="pricing-table">
            {activePlanFilter === 'Estudiante' && (
              <>
                {/* Plan Card: Pack Básico */}
                <div className="plan-card">
                    <h3>Pack Básico</h3>
                    <p className="plan-price">Gratis</p>
                    <ul className="plan-features">
                        <li><FaCheck className="feature-icon" /> Acceso a cursos gratuitos</li>
                  
                        <li><FaTimes className="feature-limitation" /> Sin certificados</li>
                        <li><FaTimes className="feature-limitation" /> Con publicidad</li>
                    </ul>
                    <Button component={Link} to="/register" variant="contained" color="primary">Comenzar</Button>
                </div>

                {/* Plan Card: Pack Inicio */}
                <div className="plan-card">
                    <h3>Pack Inicio</h3>
                    <p className="plan-price">$1 <span>/ mes</span></p>
                    <ul className="plan-features">
                        <li><FaCheck className="feature-icon" /> Acceso a 1 curso de pago/mes</li>
                        <li><FaCheck className="feature-icon" /> Certificado digital</li>
                        <li><FaCheck className="feature-icon" /> Sin publicidad</li>
                    </ul>
                    <Button component={Link} to="/register" variant="contained" color="primary">Elegir Plan</Button>
                </div>

                {/* Plan Card: Pack Estudiante (Highlight) */}
                <div className="plan-card highlight">
                    <div className="popular-badge">Popular</div>
                    <h3>Pack Estudiante</h3>
                    <p className="plan-price">$5 <span>/ mes</span></p>
                    <ul className="plan-features">
                        <li><FaCheck className="feature-icon" /> Acceso a 5 cursos de pago/mes</li>
                        <li><FaCheck className="feature-icon" /> Certificado digital</li>
                        <li><FaCheck className="feature-icon" /> Sin publicidad</li>
                    </ul>
                    <Button component={Link} to="/register" variant="contained" color="primary">Elegir Plan</Button>
                </div>

                {/* Plan Card: Pack Premium */}
                <div className="plan-card">
                    <h3>Pack Premium</h3>
                    <p className="plan-price">$15 <span>/ mes</span></p>
                    <ul className="plan-features">
                        <li><FaCheck className="feature-icon" /> Acceso ILIMITADO a todo los cursos</li>
                        <li><FaCheck className="feature-icon" /> Certificado digital</li>
                        <li><FaCheck className="feature-icon" /> Sin publicidad</li>
                        <li><FaCheck className="feature-icon" /> Contenido exclusivo</li>
                    </ul>
                    <Button component={Link} to="/register" variant="contained" color="primary">Elegir Plan</Button>
                </div>
              </>
          )}

          {activePlanFilter === 'Instructor' && (
              <>
                {/* Plan Card: Pack Básico */}
                <div className="plan-card">
                    <h3>Pack Básico</h3>
                    <p className="plan-price">Gratis</p>
                    <ul className="plan-features">
                        <li><FaCheck className="feature-icon" /> 1 Curso / 1 Sala</li>
                        <li><FaCheck className="feature-icon" /> Hasta 5 estudiantes</li>
                        <li><FaCheck className="feature-icon" /> Acceso a cursos gratuitos</li>
                        <li><FaCheck className="feature-icon" /> Analíticas básicas</li>
                    </ul>
                    <Button component={Link} to="/register" variant="contained" color="primary">Comenzar</Button>
                </div>

                {/* Plan Card: Pack Inicio */}
                <div className="plan-card">
                    <h3>Pack Inicio</h3>
                    <p className="plan-price">$15 <span>/ mes</span></p>
                    <ul className="plan-features">
                        <li><FaCheck className="feature-icon" /> 2 Cursos / 2 Salas</li>
                        <li><FaCheck className="feature-icon" /> Hasta 20 estudiantes</li>
                        <li><FaCheck className="feature-icon" /> Acceso a 2 cursos de pago/mes</li>
                        <li><FaCheck className="feature-icon" /> Analíticas básicas</li>
                    </ul>
                    <Button component={Link} to="/register" variant="contained" color="primary">Elegir Plan</Button>
                </div>

                {/* Plan Card: Pack Instructor (Highlight) */}
                <div className="plan-card highlight">
                    <div className="popular-badge">Popular</div>
                    <h3>Pack Instructor</h3>
                    <p className="plan-price">$35 <span>/ mes</span></p>
                    <ul className="plan-features">
                        <li><FaCheck className="feature-icon" /> 10 Cursos / 5 Salas</li>
                        <li><FaCheck className="feature-icon" /> Hasta 50 estudiantes</li>
                        <li><FaCheck className="feature-icon" /> Acceso a 5 cursos de pago/mes</li>
                        <li><FaCheck className="feature-icon" /> Analíticas básicas</li>
                    </ul>
                    <Button component={Link} to="/register" variant="contained" color="primary">Elegir Plan</Button>
                </div>

                {/* Plan Card: Pack Premium */}
                <div className="plan-card">
                    <h3>Pack Premium</h3>
                    <p className="plan-price">$120 <span>/ mes</span></p>
                    <ul className="plan-features">
                        <li><FaCheck className="feature-icon" /> 50 Cursos / 25 Salas</li>
                        <li><FaCheck className="feature-icon" /> Hasta 250 estudiantes</li>
                        <li><FaCheck className="feature-icon" /> Acceso ILIMITADO a todo los cursos</li>
                        <li><FaCheck className="feature-icon" /> Analíticas avanzadas</li>
                        <li><FaCheck className="feature-icon" /> Soporte por chat en vivo</li>
                    </ul>
                    <Button component={Link} to="/register" variant="contained" color="primary">Elegir Plan</Button>
                </div>
              </>
          )}
            </div>
          </Container>
        </section>

        <section className="featured-courses-section">
          <h2>Explora Nuestros Cursos Públicos</h2>

          {/* Mobile Filter Button */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', mb: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<FaFilter />}
              onClick={() => setMobileFiltersOpen(true)}
            >
              Filtros
            </Button>
          </Box>

          {/* Mobile Filter Drawer */}
          <Drawer
            anchor="left"
            open={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
            sx={{ width: { xs: '100%', sm: '60%', md: '40%' } }}
          >
            {renderFilters()}
          </Drawer>

          {/* Desktop Filters */}
          <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 4 }}>
            {renderFilters()}
          </Box>

          <div className="course-list">
            {loadingCourses ? (
              <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', width: '100%', mt: 4 }}>
                Cargando cursos...
              </Typography>
            ) : filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', width: '100%', mt: 4 }}>
                No se encontraron cursos con los filtros seleccionados.
              </Typography>
            )}
          </div>

        </section>

        
      </div>
  );
};

export default LandingPage;