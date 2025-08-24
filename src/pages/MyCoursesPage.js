// frontend/src/pages/MyCoursesPage.js

import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import CourseCard from '../components/CourseCard';
import { Box, Typography, Container, Grid, Paper, Link as MuiLink, Button, Drawer, Chip, Stack, IconButton } from '@mui/material';
import { FaFilter } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import '../styles/InternalPageHeader.css'; // Corrected import path

const MyCoursesPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    Promise.all([
      api.getMyEnrolledCourses(),
      api.getCategories()
    ]).then(([enrolledCoursesData, categoriesData]) => {
      setEnrolledCourses(enrolledCoursesData);
      setCategories(categoriesData);
    }).catch(console.error)
      .finally(() => setLoading(false));
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

  const clearFilters = () => {
    setSelectedLevel(null);
    setSelectedCategories([]);
  };

  const filteredCourses = useMemo(() => {
    return enrolledCourses.filter(course => {
      const levelMatch = selectedLevel ? course.level === selectedLevel : true;
      const categoryMatch = selectedCategories.length > 0 ? selectedCategories.includes(course.category.id) : true;
      return levelMatch && categoryMatch;
    });
  }, [enrolledCourses, selectedLevel, selectedCategories]);

  const renderFilters = () => (
    <div className="filters-section" style={{ overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h3">Filtros</Typography>
        <IconButton onClick={() => setMobileFiltersOpen(false)} aria-label="close filters">
          <FaTimes />
        </IconButton>
      </Box>

      <Box mb={2}>
        <Typography variant="subtitle1">Nivel</Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {['basico', 'intermedio', 'avanzado'].map(level => (
            <Chip 
              key={level}
              label={level.charAt(0).toUpperCase() + level.slice(1)}
              onClick={() => handleLevelSelect(level)}
              variant={selectedLevel === level ? 'filled' : 'outlined'} // Changed variant
              sx={{
                mb: 1,
                // Custom styles for selected state
                ...(selectedLevel === level && {
                  backgroundColor: '#4CAF50', // A modern green
                  color: 'white',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#388E3C', // Darker green on hover
                  },
                }),
                // Custom styles for unselected state
                ...(!(selectedLevel === level) && {
                  borderColor: '#BDBDBD', // Light grey border
                  color: '#616161', // Dark grey text
                  '&:hover': {
                    backgroundColor: '#EEEEEE', // Lighter grey on hover
                  },
                }),
              }}
              clickable
              size="medium"
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
                variant={selectedCategories.includes(category.id) ? 'filled' : 'outlined'} // Changed variant
                sx={{
                  mb: 1,
                  display: 'inline-flex',
                  // Custom styles for selected state
                  ...(selectedCategories.includes(category.id) && {
                    backgroundColor: '#2196F3', // A modern blue
                    color: 'white',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#1976D2', // Darker blue on hover
                    },
                  }),
                  // Custom styles for unselected state
                  ...(!selectedCategories.includes(category.id) && {
                    borderColor: '#BDBDBD', // Light grey border
                    color: '#616161', // Dark grey text
                    '&:hover': {
                      backgroundColor: '#EEEEEE', // Lighter grey on hover
                    },
                  }),
                }}
                clickable
                size="medium"
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

  if (loading) return <Typography sx={{ textAlign: 'center', mt: 4 }}>Cargando tus cursos...</Typography>;

  return (
    <div className="landing-container">
      <div className="internal-hero-section"> {/* Changed class name */}
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' }, fontWeight: 'bold' }}>
            Mis Cursos
          </Typography>
          <p>Continúa tu aventura de aprendizaje.</p>
        </Container>
      </div>

      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
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

          {filteredCourses.length > 0 ? (
            <Grid container spacing={4}>
              {filteredCourses.map(course => (
                <Grid item key={course.id} xs={12} sm={6} md={4}>
                  <CourseCard course={course} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center', mt: 4 }}>
              <Typography variant="h6">
                No tienes cursos que coincidan con los filtros seleccionados.
              </Typography>
              <Typography>
                ¡Explora la <MuiLink href="/courses">galería de cursos</MuiLink> para encontrar más!
              </Typography>
            </Paper>
          )}
        </Container>
      </Box>
    </div>
  );
};

export default MyCoursesPage;