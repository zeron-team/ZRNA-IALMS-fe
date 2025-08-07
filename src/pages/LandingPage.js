// frontend/src/pages/LandingPage.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { FaBrain, FaChalkboardTeacher, FaUserGraduate, FaPlusCircle, FaUniversity, FaSignInAlt, FaCheck } from 'react-icons/fa';
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
              Nuestra plataforma crea rutas de conocimiento y cursos a tu medida, generados por inteligencia artificial
              para acelerar tu carrera profesional.
            </p>
            <div className="hero-cta">
              <Link to="/register" className="btn btn-primary btn-lg">Comienza a Aprender Gratis</Link>
            </div>
          </div>
          <div className="hero-visual">
            <NeuralNetworkAnimation/>
          </div>
        </header>

        {/* --- NUEVA SECCIÓN: CARRUSEL DE BENEFICIOS --- */}
        <section className="features-carousel-section">
          <h2>Una Plataforma, Infinitas Posibilidades</h2>
          <div className="feature-carousel">
            <div className="feature-slide">
              <FaPlusCircle className="feature-slide-icon"/>
              <h3>Crea Tus Propios Cursos</h3>
              <p>Como estudiante, tienes el poder de crear hasta dos cursos y compartirlos con la comunidad o de forma
                privada.</p>
            </div>
            <div className="feature-slide">
              <FaChalkboardTeacher className="feature-slide-icon"/>
              <h3>Gestiona Salas Privadas</h3>
              <p>Como instructor, puedes crear salas exclusivas, añadir cursos y gestionar a tus alumnos en un entorno
                controlado.</p>
            </div>
            <div className="feature-slide">
              <FaBrain className="feature-slide-icon"/>
              <h3>Contenido Generado por IA</h3>
              <p>Guía a nuestra IA con tu propio material (PDF, DOCX) para generar currículas y lecciones 100%
                personalizadas.</p>
            </div>
          </div>
        </section>

        {/* --- NUEVA SECCIÓN: ROLES --- */}
        <section className="roles-section">
          <h2>Un Rol para Cada Protagonista</h2>

          {/* --- Sección Instructor --- */}
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

          {/* --- NUEVA SECCIÓN: Estudiante --- */}
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