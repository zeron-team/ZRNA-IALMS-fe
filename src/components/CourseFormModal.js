// frontend/src/components/CourseFormModal.js

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/UserFormModal.css'; // Reutilizamos estilos

const CourseFormModal = ({ course, onClose, onSave }) => {
  const isEditMode = Boolean(course);

  // 1. Añadimos los nuevos campos al estado del formulario
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    category_id: course?.category?.id || '',
    level: course?.level || 'basico',
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  // 2. Obtenemos la lista de categorías para el menú desplegable
  useEffect(() => {
    api.getCategories()
      .then(setCategories)
      .catch(err => console.error("No se pudieron cargar las categorías", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 3. Nos aseguramos de enviar los nuevos datos
    const payload = {
      title: formData.title,
      description: formData.description,
      category_id: parseInt(formData.category_id),
      level: formData.level,
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
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{isEditMode ? 'Editar Curso' : 'Crear Nuevo Curso'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Título del Curso</label>
          <input name="title" value={formData.title} onChange={handleChange} required />

          <label>Descripción</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />

          {/* --- 4. NUEVOS CAMPOS EN EL FORMULARIO --- */}
          <div className="form-grid">
            <div className="form-group">
              <label>Categoría</label>
              <select name="category_id" value={formData.category_id} onChange={handleChange} required>
                <option value="" disabled>Selecciona una categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Nivel</label>
              <select name="level" value={formData.level} onChange={handleChange} required>
                <option value="basico">Básico</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseFormModal;