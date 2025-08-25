import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Modal, Box, Typography, Button, TextField, Select, MenuItem, InputLabel, FormControl, Checkbox, FormControlLabel } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  outline: 'none',
};

const CourseFormModal = ({ course, open, onClose, onSave }) => {
  const isEditMode = Boolean(course);

  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    category_id: course?.category?.id || '',
    level: course?.level || 'basico',
    is_free: course?.is_free ?? true,
    price: course?.price || '',
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getCategories()
      .then(setCategories)
      .catch(err => console.error("No se pudieron cargar las categorías", err));
  }, []);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        category_id: course.category?.id || '',
        level: course.level || 'basico',
        is_free: course.is_free ?? true,
        price: course.price || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category_id: '',
        level: 'basico',
        is_free: true,
        price: '',
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      title: formData.title,
      description: formData.description,
      category_id: parseInt(formData.category_id),
      level: formData.level,
      price: formData.is_free ? 0 : parseFloat(formData.price) || 0,
    };

    try {
      if (isEditMode) {
        await api.updateCourse(course.id, payload);
      } else {
        await api.createCourse(payload);
      }
      onSave();
    } catch (err) {
      setError(err.message || 'Error al guardar el curso.');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">{isEditMode ? 'Editar Curso' : 'Crear Nuevo Curso'}</Typography>
        <form onSubmit={handleSubmit}>
          <TextField name="title" label="Título del Curso" value={formData.title} onChange={handleChange} fullWidth margin="normal" required />
          <TextField name="description" label="Descripción" value={formData.description} onChange={handleChange} fullWidth margin="normal" multiline rows={4} required />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Categoría</InputLabel>
              <Select name="category_id" value={formData.category_id} label="Categoría" onChange={handleChange}>
                <MenuItem value="" disabled>Selecciona una categoría</MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Nivel</InputLabel>
              <Select name="level" value={formData.level} label="Nivel" onChange={handleChange}>
                <MenuItem value="basico">Básico</MenuItem>
                <MenuItem value="intermedio">Intermedio</MenuItem>
                <MenuItem value="avanzado">Avanzado</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {error && <Typography color="error">{error}</Typography>}
          <FormControlLabel
            control={<Checkbox name="is_free" checked={formData.is_free} onChange={handleChange} />}
            label="Este curso es gratuito"
          />
          {!formData.is_free && (
            <TextField
              type="number"
              name="price"
              label="Precio del Curso (USD)"
              value={formData.price}
              onChange={handleChange}
              placeholder="Ej: 19.99"
              fullWidth
              margin="normal"
              InputProps={{ inputProps: { step: "0.01" } }}
            />
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={onClose} sx={{ mr: 1 }}>Cancelar</Button>
            <Button type="submit" variant="contained">Guardar</Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CourseFormModal;