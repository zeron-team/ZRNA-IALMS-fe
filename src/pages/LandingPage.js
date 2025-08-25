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
            {/* ... other feature cards ... */}
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
            {/* Pricing plans mapped here */}
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
