// frontend/src/pages/CreateCoursePage.js

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Container, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import '../styles/InternalPageHeader.css'; // Corrected import path

const CreateCoursePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    level: 'basico'
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        category_id: parseInt(formData.category_id),
      };
      const newCourse = await api.createCourse(payload);
      alert('¡Curso creado con éxito! Ahora puedes empezar a añadirle módulos.');
      navigate(`/course/${newCourse.id}`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="landing-container">
      <div className="internal-hero-section"> {/* Changed class name */}
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' }, fontWeight: 'bold' }}>
            Crea tu Propio Curso
          </Typography>
          <p>Comparte tu conocimiento con el mundo.</p>
        </Container>
      </div>

      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <Container component="main" maxWidth="md">
          <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Detalles del Curso
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Título del Curso"
                name="title"
                value={formData.title}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="description"
                label="Descripción"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                <InputLabel id="category-label">Categoría</InputLabel>
                <Select
                  labelId="category-label"
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  label="Categoría"
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="" disabled>Selecciona una categoría...</MenuItem>
                  {categories.map(cat => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                <InputLabel id="level-label">Nivel de Dificultad</InputLabel>
                <Select
                  labelId="level-label"
                  id="level"
                  name="level"
                  value={formData.level}
                  label="Nivel de Dificultad"
                  onChange={handleChange}
                >
                  <MenuItem value="basico">Básico</MenuItem>
                  <MenuItem value="intermedio">Intermedio</MenuItem>
                  <MenuItem value="avanzado">Avanzado</MenuItem>
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" size="large" fullWidth>
                Crear Curso y Continuar
              </Button>
            </form>
          </Paper>
        </Container>
      </Box>
    </div>
  );
};

export default CreateCoursePage;