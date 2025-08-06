// frontend/src/pages/CreateCoursePage.css

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateCoursePage.css';

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
    <div className="page-container">
      <div className="page-header">
        <h1>Crea tu Propio Curso</h1>
      </div>
      <div className="page-panel">
        <form onSubmit={handleSubmit} className="create-course-form">
          <div className="form-group">
            <label>Título del Curso</label>
            <p>Dale un nombre atractivo que describa tu curso.</p>
            <input name="title" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <p>Describe de qué trata tu curso y qué aprenderán los estudiantes.</p>
            <textarea name="description" rows="4" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <p>Elige la categoría que mejor se adapte a tu curso.</p>
            <select name="category_id" value={formData.category_id} onChange={handleChange} required>
              <option value="" disabled>Selecciona una categoría...</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Nivel de Dificultad</label>
            <select name="level" value={formData.level} onChange={handleChange}>
              <option value="basico">Básico</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Crear Curso y Continuar</button>
        </form>
      </div>
    </div>
  );
};

export default CreateCoursePage;