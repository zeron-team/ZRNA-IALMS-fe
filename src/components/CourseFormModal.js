// frontend/src/components/CourseFormModal.js

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './UserFormModal.css'; // Reutilizamos los estilos del modal

const CourseFormModal = ({ course, onClose, onSave }) => {
  const isEditMode = Boolean(course); // Si recibe un curso, está en modo edición

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Rellena el formulario si estamos en modo edición
  useEffect(() => {
    if (isEditMode) {
      setTitle(course.title);
      setDescription(course.description);
    }
  }, [isEditMode, course]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const courseData = { title, description };

    try {
      if (isEditMode) {
        // Llama a la API para actualizar
        await api.updateCourse(course.id, courseData);
      } else {
        // Llama a la API para crear
        await api.createCourse(courseData);
      }
      onSave(); // Llama a la función onSave para recargar los cursos
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
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          {error && <p className="error-message">{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseFormModal;