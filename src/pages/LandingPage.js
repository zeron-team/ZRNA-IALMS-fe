// frontend/src/pages/LandingPage.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { FaBrain, FaDraftingCompass, FaRocket } from 'react-icons/fa';
import NeuralNetworkAnimation from '../components/NeuralNetworkAnimation';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const [courseData, setCourseData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Carga las categorías con sus cursos para mostrarlos en la landing
    api.getCategoriesWithCourses()
      .then(setCourseData)
      .catch(console.error);
  }, []);

  return (
    <div className="landing-container">
      {/* --- Sección Hero --- */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>El Futuro del Aprendizaje es Impulsado por IA</h1>
          <p className="hero-subtitle">
            Nuestra plataforma crea rutas de conocimiento y cursos a tu medida, generados por inteligencia artificial para acelerar tu carrera profesional.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">Comienza a Aprender Gratis</Link>
            {/*<Link to="/courses" className="btn btn-secondary btn-lg">Explorar Cursos</Link> */}
          </div>
        </div>
        <div className="hero-visual">
          <NeuralNetworkAnimation />
        </div>
      </header>

      {/* --- Sección "Cómo Funciona" --- */}
      <section className="how-it-works">
        <h2>Un Ecosistema de Aprendizaje Inteligente</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-icon-wrapper"><FaDraftingCompass className="step-icon" /></div>
            <h3>1. Elige tu Futuro</h3>
            <p>Selecciona una de nuestras Rutas de Conocimiento diseñadas para carreras de alta demanda.</p>
          </div>
          <div className="step-card">
            <div className="step-icon-wrapper"><FaBrain className="step-icon" /></div>
            <h3>2. Contenido Creado por IA</h3>
            <p>Nuestra IA genera currículas, lecciones y quizzes completos, siempre actualizados y relevantes.</p>
          </div>
          <div className="step-card">
            <div className="step-icon-wrapper"><FaRocket className="step-icon" /></div>
            <h3>3. Acelera tu Progreso</h3>
            <p>Avanza a través de módulos con quizzes interactivos que validan tu conocimiento.</p>
          </div>
        </div>
      </section>

      {/* --- Sección Cursos por Categoría --- */}
      <section className="featured-courses-section">
        <h2>Explora Nuestros Cursos</h2>
        {courseData.map(category => (
          category.courses.length > 0 && (
            <div key={category.id} className="category-row">
              <h3>{category.name}</h3>
              <div className="course-list">
                {category.courses.map(course => (
                  <div key={course.id} className="course-card" onClick={() => navigate(`/course/${course.id}`)}>
                    <div className="course-card-content">
                      <span className={`tag-level level-${course.level}`}>{course.level}</span>
                      <h4>{course.title}</h4>
                      <p>{course.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </section>
    </div>
  );
};

export default LandingPage;