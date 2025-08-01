/* frontend/src/components/CourseForm.js  */

import React, { useState } from 'react';
import { api } from '../services/api';

function CourseForm({ course, onSave }) {
  const [title, setTitle] = useState(course ? course.title : '');
  const [description, setDescription] = useState(course ? course.description : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const courseData = { title, description };

    if (course) {
      // Lógica de actualización
      await api.updateCourse(course.id, courseData);
    } else {
      // Lógica de creación
      await api.createCourse(courseData);
    }
    onSave(); // Para cerrar el modal o redirigir
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{course ? 'Editar' : 'Crear'} Curso</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título del curso"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción del curso"
        required
      />
      <button type="submit">Guardar Curso</button>
    </form>
  );
}

export default CourseForm;