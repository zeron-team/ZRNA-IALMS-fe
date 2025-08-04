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
    api.getCategoriesWithCourses()
      .then(setCourseData)
      .catch(console.error);
  }, []);

  return (
    <div className="landing-container">
      <header className="hero-section">
        <div className="hero-content">
          <h1>El Futuro del Aprendizaje es Impulsado por IA</h1>
          <p className="hero-subtitle">
            Nuestra plataforma crea rutas de conocimiento y cursos a tu medida, generados por inteligencia artificial para acelerar tu carrera profesional.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-lg">Comienza a Aprender Gratis</Link>
          </div>
        </div>
        <div className="hero-visual">
          <NeuralNetworkAnimation />
        </div>
      </header>

      <section className="why-ai-section">
        <h2>¿Por Qué IA en la Educación?</h2>
        <p className="section-subtitle">
          Revolucionamos el aprendizaje tradicional con contenido que se adapta, evoluciona y te prepara para el futuro del trabajo.
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <FaDraftingCompass className="feature-icon" />
            <h3>Aprendizaje Personalizado</h3>
            <p>La IA diseña Rutas de Conocimiento únicas y sugiere cursos basados en tus objetivos y progreso.</p>
          </div>
          <div className="feature-card">
            <FaBrain className="feature-icon" />
            <h3>Contenido Siempre Relevante</h3>
            <p>Nuestra IA genera currículas y lecciones basadas en la información más actual del mundo tecnológico.</p>
          </div>
          <div className="feature-card">
            <FaRocket className="feature-icon" />
            <h3>Evaluación Inteligente</h3>
            <p>Nuestros quizzes, creados por IA, no solo miden tu conocimiento, sino que te ayudan a mejorar.</p>
          </div>
        </div>
      </section>

      <section className="featured-courses-section">
        <h2>Explora Nuestros Cursos</h2>
        {courseData.map(category => (
          category.courses.length > 0 && (
            <div key={category.id} className="category-row">
              <h3>{category.name}</h3>
              <div className="course-list">
                {category.courses.map(course => (
                  <div key={course.id} className="course-card" onClick={() => navigate(`/login`)}>
                    <div className="course-card-image"></div>
                    <div className="course-card-content">
                      <div className="course-card-tags">
                        <span className={`tag-level level-${course.level}`}>{course.level}</span>
                      </div>
                      <h2>{course.title}</h2>
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