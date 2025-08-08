// frontend/src/pages/LandingPage.js

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { FaBrain, FaChalkboardTeacher, FaPlusCircle, FaCheck } from 'react-icons/fa';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const [categories, setCategories] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const navigate = useNavigate();

  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    Promise.all([
      api.getCategories(),
      api.getCourses()
    ]).then(([categoryData, courseData]) => {
      setCategories(categoryData);
      setAllCourses(courseData);
    }).catch(console.error);
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

  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      const levelMatch = selectedLevel ? course.level === selectedLevel : true;
      const categoryMatch = selectedCategories.length > 0 ? selectedCategories.includes(course.category.id) : true;
      return levelMatch && categoryMatch;
    });
  }, [allCourses, selectedLevel, selectedCategories]);

  return (
    <div className="landing-container">
      <header className="hero-section">
        <div className="hero-content">
          <h1>El Futuro del Aprendizaje es Impulsado por IA</h1>
          <p className="hero-subtitle">
            Nuestra plataforma crea rutas de conocimiento y cursos a tu medida, generados por inteligencia artificial para acelerar tu carrera profesional.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">Comienza a Aprender</Link>
          </div>
        </div>
      </header>

        <section className="features-section">
        <h2>Una Plataforma, Infinitas Posibilidades</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaPlusCircle className="feature-icon" />
            <h3>Crea Tus Propios Cursos</h3>
            <p>Como estudiante, tienes el poder de crear hasta dos cursos y compartirlos.</p>
          </div>
          <div className="feature-card">
            <FaChalkboardTeacher className="feature-icon" />
            <h3>Gestiona Salas Privadas</h3>
            <p>Como instructor, puedes crear salas exclusivas, añadir cursos y gestionar a tus alumnos.</p>
          </div>
          <div className="feature-card">
            <FaBrain className="feature-icon" />
            <h3>Contenido Generado por IA</h3>
            <p>Guía a nuestra IA con tu propio material para generar currículas y lecciones personalizadas.</p>
          </div>
        </div>
      </section>

        <section className="roles-section">
          <h2>Un Rol para Cada Protagonista</h2>
          <div className="roles-container">
            <div className="role-description">
              <h3>El Instructor: Tu Propia Academia</h3>
              <p>Toma el control total de la enseñanza. Crea salas, diseña cursos con la ayuda de la IA e invita a tus
                alumnos a un espacio de aprendizaje único.</p>
              <ul>
                <li><span className="icon"><FaCheck/></span> Crea y gestiona salas privadas.</li>
                <li><span className="icon"><FaCheck/></span> Añade tus cursos y gestiona a tus miembros.</li>
                <li><span className="icon"><FaCheck/></span> Supervisa el progreso de tus alumnos.</li>
              </ul>
            </div>
            <div className="role-image">
              <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070"
                   alt="Instructor enseñando"/>
            </div>
          </div>
          <div className="roles-container reverse">
            <div className="role-description">
              <h3>El Estudiante: Tu Aventura de Conocimiento</h3>
              <p>Aprende a tu propio ritmo, sigue rutas de aprendizaje inteligentes o desata tu creatividad y construye
                tus propios cursos para compartir con el mundo.</p>
              <ul>
                <li><span className="icon"><FaCheck/></span> Sigue rutas de aprendizaje personalizadas.</li>
                <li><span className="icon"><FaCheck/></span> Aprende con contenido y quizzes generados por IA.</li>
                <li><span className="icon"><FaCheck/></span> Crea y comparte hasta dos de tus propios cursos.</li>
              </ul>
            </div>
            <div className="role-image">
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070"
                   alt="Estudiantes aprendiendo"/>
            </div>
          </div>
        </section>

        <section className="featured-courses-section">
          <h2>Explora Nuestros Cursos</h2>
          <div className="course-filters">
            <div className="filter-group">
              <h4>Nivel:</h4>
              <div className="filter-buttons">
                {['basico', 'intermedio', 'avanzado'].map(level => (
                    <button
                        key={level}
                        onClick={() => handleLevelSelect(level)}
                        className={`filter-btn ${selectedLevel === level ? 'active' : ''}`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <h4>Categorías:</h4>
              <div className="filter-buttons">
                {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryToggle(category.id)}
                        className={`filter-btn ${selectedCategories.includes(category.id) ? 'active' : ''}`}
                    >
                      {category.name}
                    </button>
                ))}
              </div>
            </div>
          </div>

          <div className="course-list">
            {filteredCourses.map(course => (
                <div key={course.id} className="course-card" onClick={() => navigate(`/login`)}>
                  <div className="course-card-image"></div>
                  <div className="course-card-content">
                    <h2>{course.title}</h2>
                    <p>{course.description}</p>
                  </div>
                </div>
            ))}
          </div>
        </section>
      </div>
  );
};

export default LandingPage;