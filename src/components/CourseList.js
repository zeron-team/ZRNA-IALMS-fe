import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from '../auth/AuthContext';
import StarRating from '../components/StarRating';
import { Box, Typography, Grid, Button, Chip, Stack, Paper, Card, CardContent, CardActions } from '@mui/material';

const CourseList = () => {
  const { user } = useAuth();
  const [allCourses, setAllCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);

  const fetchCourses = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.getCourses(),
      api.getCategories()
    ]).then(([courseData, categoryData]) => {
      setAllCourses(courseData.map(course => ({ ...course, isDescriptionExpanded: false })));
      setCategories(categoryData);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleLevelSelect = (level) => {
    setSelectedLevel(prev => prev === level ? null : level);
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handlePriceSelect = (priceType) => {
    setSelectedPrice(prev => prev === priceType ? null : priceType);
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

  const handleEnroll = async (e, courseId, courseTitle) => {
    e.stopPropagation();
    try {
      await api.enrollInCourse(courseId);
      alert(`¡Te has inscrito en "${courseTitle}" con éxito!`);
      fetchCourses();
    } catch (error) {
      alert(`Error al inscribirte: ${error.message}`);
    }
  };

  const handleToggleDescriptionExpand = (e, courseId) => {
    e.stopPropagation();
    setAllCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? { ...course, isDescriptionExpanded: !course.isDescriptionExpanded }
          : course
      )
    );
  };

  if (loading) return <Typography sx={{ textAlign: 'center', mt: 4 }}>Cargando cursos...</Typography>;

  const userPlan = user?.plan || 'Estudiante Básico';

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Catálogo de Cursos
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
        <Stack spacing={2}>
          <FilterGroup title="Tipo:">
            <Chip label="Gratis" onClick={() => handlePriceSelect('free')} variant={selectedPrice === 'free' ? 'filled' : 'outlined'} clickable />
            <Chip label="Pago" onClick={() => handlePriceSelect('paid')} variant={selectedPrice === 'paid' ? 'filled' : 'outlined'} clickable />
          </FilterGroup>
          <FilterGroup title="Nivel:">
            {['basico', 'intermedio', 'avanzado'].map(level => (
              <Chip key={level} label={level.charAt(0).toUpperCase() + level.slice(1)} onClick={() => handleLevelSelect(level)} variant={selectedLevel === level ? 'filled' : 'outlined'} clickable />
            ))}
          </FilterGroup>
          <FilterGroup title="Categorías:">
            {categories.map(category => (
              <Chip key={category.id} label={category.name} onClick={() => handleCategoryToggle(category.id)} variant={selectedCategories.includes(category.id) ? 'filled' : 'outlined'} clickable />
            ))}
          </FilterGroup>
        </Stack>
      </Paper>

      <Grid container spacing={4}>
        {filteredCourses.map(course => (
          <Grid item key={course.id} xs={12} sm={6} md={4}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Chip label={course.category?.name || 'General'} size="small" />
                  <Chip label={course.price > 0 ? 'Pago' : 'Gratis'} size="small" color={course.price > 0 ? 'secondary' : 'success'} />
                </Stack>
                <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                  {course.title}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {course.level}
                </Typography>
                <Typography variant="body2" component="p" className={`course-description-truncated ${course.isDescriptionExpanded ? 'expanded' : ''}`}>
                  {course.description}
                </Typography>
                <StarRating total={course.total_stars} earned={course.earned_stars} />
              </CardContent>
              <CardActions>
                <Button size="small" onClick={(e) => handleToggleDescriptionExpand(e, course.id)}>
                  {course.isDescriptionExpanded ? 'Ver menos' : 'Ver más'}
                </Button>
                <Button size="small" variant="contained" onClick={(e) => handleEnroll(e, course.id, course.title)} disabled={userPlan === 'Estudiante Básico' && course.price > 0}>
                  Inscribirme
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      </Box>
  );
};

const FilterGroup = ({ title, children }) => (
  <Box>
    <Typography variant="subtitle1" gutterBottom>{title}</Typography>
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      {children}
    </Stack>
  </Box>
);

export default CourseList;