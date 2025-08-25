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
  FaArrowRight,
  FaFilter,
  FaBroom,
  FaPlayCircle,
  FaCheckCircle,
} from 'react-icons/fa';
import CourseCard from '../components/CourseCard';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  Drawer, 
  Chip, 
  Stack, 
  IconButton,
  CardContent,
  Paper
} from '@mui/material';


const LandingPage = () => {
  const [categories, setCategories] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [activePlanFilter, setActivePlanFilter] = useState('Estudiante');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);

  const studentPlans = [
    {
      name: 'Plan Básico',
      price: 'Gratis',
      features: [
        'Acceso a cursos gratuitos',
        
      ],
      isFree: true,
    },
    {
      name: 'Plan Premium',
      price: '$9.99',
      period: '/mes',
      features: [
        'Acceso ilimitado a todos los cursos',
        'Contenido avanzado de IA',
        'Certificación al completar el curso',
        
      ],
      isFree: false,
    },
  ];

  const instructorPlans = [
    {
      name: 'Plan Inicio Gratis',
      price: 'Gratis',
      features: [
        'Creación de 1 curso con IA',
        'Creación de salas con 1 curso y hasta 3 estudiantes',
        'Dashboard básico',
      ],
      isFree: true,
    },
    {
      name: 'Plan Básico',
      price: '$9.99',
      period: '/mes',
      features: [
        'Creación de 3 cursos con IA',
        'Creación de salas con 2 curso y hasta 10 estudiantes',
        'Dashboard básico',

      ],
      isFree: false,
    },
    {
      name: 'Plan Corporativo',
      price: '$99.99',
      period: '/mes',
      features: [
        'Soluciones personalizadas para empresas',
        'Creación de salas con cursos',
        'Gestión de equipos y roles',
        'Soporte técnico 24/7',
        'Logo de la empresa en la plataforma',
        'Reportes avanzados y analíticas',
      ],
      isFree: false,
    },
  ];

  useEffect(() => {
    setLoadingCourses(true);
    Promise.all([
      api.getCategories(),
      api.getCourses()
    ]).then(([categoryData, courseData]) => {
      setCategories(categoryData);
      setAllCourses(courseData);
    }).catch(console.error)
      .finally(() => {
        setLoadingCourses(false);
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
    <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h3">Filtros</Typography>
        <IconButton onClick={() => setMobileFiltersOpen(false)} aria-label="close filters" sx={{ display: { md: 'none' } }}>
          <FaTimes />
        </IconButton>
      </Box>
      
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle1" gutterBottom>Tipo</Typography>
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

        <Box>
          <Typography variant="subtitle1" gutterBottom>Nivel</Typography>
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

        <Box>
          <Typography variant="subtitle1" gutterBottom>Categorías</Typography>
          {categories.length > 0 ? (
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              {categories.map(category => (
                <Chip
                  key={category.id}
                  label={category.name}
                  onClick={() => handleCategoryToggle(category.id)}
                  color={selectedCategories.includes(category.id) ? 'primary' : 'default'}
                  clickable
                  size="small"
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">Cargando categorías...</Typography>
          )}
        </Box>

        <Button onClick={clearFilters} variant="outlined">Limpiar Filtros</Button>
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(45deg, #001E3C 30%, #004E89 90%)',
        color: 'white',
        py: { xs: 8, md: 12 },
        textAlign: 'center',
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" fontWeight="700" gutterBottom>
            El Futuro del Aprendizaje es Impulsado por IA
          </Typography>
          <Typography variant="h5" component="p" color="#e0e0e0" sx={{ mb: 4 }}>
            Descubre una nueva forma de aprender con nuestra plataforma inteligente.
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            endIcon={<FaArrowRight />}
            sx={{ 
              bgcolor: '#FFD700', 
              color: '#001E3C', 
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#FFC700' }
            }}
          >
            Comienza tu Aventura
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom textAlign="center" fontWeight="bold">
            Una Plataforma, Infinitas Posibilidades
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', p: 2, textAlign: 'center' }}>
                <FaUserGraduate size={40} color="primary.main" />
                <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1, fontWeight: 'bold'}}>
                  Comienza a Estudiar
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Inicia tu viaje de aprendizaje con cursos personalizados y contenido generado por IA.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', p: 2, textAlign: 'center' }}>
                <FaChalkboardTeacher size={40} color="primary.main" />
                <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1, fontWeight: 'bold'}}>
                  Enseña con IA
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Crea y gestiona cursos con la ayuda de herramientas de IA para instructores.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', p: 2, textAlign: 'center' }}>
                <FaBrain size={40} color="primary.main" />
                <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1, fontWeight: 'bold'}}>
                  Contenido Inteligente
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Accede a material de estudio adaptado a tus necesidades y ritmo de aprendizaje.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', p: 2, textAlign: 'center' }}>
                <FaPlusCircle size={40} color="primary.main" />
                <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1, fontWeight: 'bold'}}>
                  Siempre Actualizado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Nuestra IA asegura que el contenido esté siempre al día con las últimas tendencias.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Student/Instructor Options Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom textAlign="center" fontWeight="bold" sx={{ mb: 6 }}>
            Explora tus Opciones en Zeron AcademIA
          </Typography>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                  Para Estudiantes
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Sumérgete en un mundo de conocimiento con cursos generados por IA, rutas de aprendizaje personalizadas y una comunidad vibrante. Aprende a tu propio ritmo y domina las habilidades del futuro.
                </Typography>
                <Button variant="contained" component={Link} to="/register" size="large">
                  Comenzar a Aprender
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src="https://images.unsplash.com/photo-1546410531-bb448c51d866?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Estudiantes" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
              <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                  Para Instructores
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Comparte tu experiencia y crea cursos innovadores con el apoyo de nuestras herramientas de IA. Gestiona tus estudiantes, organiza salas de estudio y expande tu alcance.
                </Typography>
                <Button variant="contained" component={Link} to="/register" size="large">
                  Convertirse en Instructor
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src="https://images.unsplash.com/photo-1523240795601-049865a410c2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Instructores" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom textAlign="center" fontWeight="bold">
            Un Plan para Cada Miembro de Nuestra Comunidad
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
            Elige el camino que mejor se adapte a tus objetivos, ya sea para aprender o para enseñar.
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
            <Chip label="Planes para Estudiantes" color={activePlanFilter === 'Estudiante' ? 'primary' : 'default'} onClick={() => setActivePlanFilter('Estudiante')} />
            <Chip label="Planes para Instructores" color={activePlanFilter === 'Instructor' ? 'primary' : 'default'} onClick={() => setActivePlanFilter('Instructor')} />
          </Stack>

          <Grid container spacing={4} justifyContent="center">
            {activePlanFilter === 'Estudiante' && studentPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card elevation={3} sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <CardContent>
                    <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                      {plan.name}
                    </Typography>
                    <Typography variant="h3" color="primary.main" fontWeight="bold" sx={{ my: 2 }}>
                      {plan.price}{plan.period && <Typography component="span" variant="h6" color="text.secondary">{plan.period}</Typography>}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      {plan.isFree ? 'Acceso ilimitado a cursos gratuitos y contenido básico.' : 'Herramientas avanzadas para crear y gestionar cursos con IA.'}
                    </Typography>
                    <Stack component="ul" sx={{ listStyle: 'none', p: 0, mb: 3 }} spacing={1}>
                      {plan.features.map((feature, idx) => (
                        <Typography component="li" variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} key={idx}>
                          <FaCheckCircle color="green" style={{ marginRight: 8 }} /> {feature}
                        </Typography>
                      ))}
                    </Stack>
                  </CardContent>
                  <Button variant="contained" color="primary" component={Link} to="/register" size="large">
                    {plan.isFree ? 'Comenzar Gratis' : 'Obtener Plan'}
                  </Button>
                </Card>
              </Grid>
            ))}
            {activePlanFilter === 'Instructor' && instructorPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card elevation={3} sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <CardContent>
                    <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                      {plan.name}
                    </Typography>
                    <Typography variant="h3" color="primary.main" fontWeight="bold" sx={{ my: 2 }}>
                      {plan.price}{plan.period && <Typography component="span" variant="h6" color="text.secondary">{plan.period}</Typography>}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      Herramientas avanzadas para crear y gestionar cursos con IA.
                    </Typography>
                    <Stack component="ul" sx={{ listStyle: 'none', p: 0, mb: 3 }} spacing={1}>
                      {plan.features.map((feature, idx) => (
                        <Typography component="li" variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} key={idx}>
                          <FaCheckCircle color="green" style={{ marginRight: 8 }} /> {feature}
                        </Typography>
                      ))}
                    </Stack>
                  </CardContent>
                  <Button variant="contained" color="primary" component={Link} to="/register" size="large">
                    {plan.isFree ? 'Comenzar Gratis' : 'Obtener Plan'}
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Courses Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom textAlign="center" fontWeight="bold">
            Explora Nuestros Cursos Públicos
          </Typography>

          <Box sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', mb: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<FaFilter />}
              onClick={() => setMobileFiltersOpen(true)}
            >
              Filtros
            </Button>
          </Box>

          <Drawer anchor="left" open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
            <Box sx={{ width: 280, p: 2 }}>
              {renderFilters()}
            </Box>
          </Drawer>

          <Grid container spacing={4}>
            <Grid item md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
              {renderFilters()}
            </Grid>
            <Grid item xs={12} md={9}>
              {loadingCourses ? (
                <Typography>Cargando cursos...</Typography>
              ) : (
                <Grid container spacing={2}>
                  {filteredCourses.map(course => (
                    <Grid item xs={12} sm={6} lg={4} key={course.id}>
                      <CourseCard course={course} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
