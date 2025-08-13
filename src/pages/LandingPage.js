// frontend/src/pages/LandingPage.js

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  FaBrain,
  FaChalkboardTeacher,
  FaPlusCircle,
  FaCheck,
  FaTimes,
  //FaBuilding,
  FaUserGraduate,

} from 'react-icons/fa';
import CourseCard from '../components/CourseCard';
import '../styles/LandingPage.css';
import '../styles/PricingPage.css';

const LandingPage = () => {
  const [categories, setCategories] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  //const navigate = useNavigate();
  const [activePlanFilter, setActivePlanFilter] = useState('Estudiante');

  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);

  useEffect(() => {
    Promise.all([
      api.getCategories(),
      api.getCourses()
    ]).then(([categoryData, courseData]) => {
      setCategories(categoryData);
      setAllCourses(courseData);
    }).catch(console.error);
  }, []);


  // --- FUNCIONES PARA MANEJAR LOS FILTROS ---
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
  const handlePriceSelect = (priceType) => {
    setSelectedPrice(prev => prev === priceType ? null : priceType);
  };

  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      const levelMatch = selectedLevel ? course.level === selectedLevel : true;
      const categoryMatch = selectedCategories.length > 0 ? selectedCategories.includes(course.category.id) : true;
      const priceMatch = selectedPrice
        ? (selectedPrice === 'free' ? course.price === 0 : course.price > 0)
        : true;
      return levelMatch && categoryMatch && priceMatch;
    });
  }, [allCourses, selectedLevel, selectedCategories, selectedPrice]);

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
              <Link to="/register" className="btn btn-primary btn-lg">Comienza a Aprender</Link>
            </div>
          </div>
        </header>

        <section className="features-section">
          <h2>Una Plataforma, Infinitas Posibilidades</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaPlusCircle className="feature-icon"/>
              <h3>Crea Tus Propios Cursos</h3>
              <p>Como estudiante, tienes el poder de crear hasta dos cursos y compartirlos.</p>
            </div>
            <div className="feature-card">
              <FaChalkboardTeacher className="feature-icon"/>
              <h3>Gestiona Salas Privadas</h3>
              <p>Como instructor, puedes crear salas exclusivas, añadir cursos y gestionar a tus alumnos.</p>
            </div>
            <div className="feature-card">
              <FaBrain className="feature-icon"/>
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


        <section className="pricing-section">
          <h2>Un Plan para Cada Miembro de Nuestra Comunidad</h2>
          <p className="section-subtitle">Elige el camino que mejor se adapte a tus objetivos, ya sea para aprender o
            para enseñar.</p>

          <div className="role-filter-container">
            <div className={`role-filter-card ${activePlanFilter === 'Estudiante' ? 'active' : ''}`}
                 onClick={() => setActivePlanFilter('Estudiante')}>
              <FaUserGraduate size={30} style={{color: 'var(--accent)'}}/>
              <h3>Planes para Estudiantes</h3>
            </div>
            <div className={`role-filter-card ${activePlanFilter === 'Instructor' ? 'active' : ''}`}
                 onClick={() => setActivePlanFilter('Instructor')}>
              <FaChalkboardTeacher size={30} style={{color: 'var(--accent)'}}/>
              <h3>Planes para Instructores</h3>
            </div>
            {/*<div className={`role-filter-card ${activePlanFilter === 'Corporativo' ? 'active' : ''}`}
                  onClick={() => setActivePlanFilter('Corporativo')}>
              <FaBuilding size={30}/>
              <h3>Soluciones Corporativas</h3>
            </div>*/}
          </div>

          {activePlanFilter === 'Estudiante' && (
              <div className="pricing-table">
                <div className="plan-card">
                  <h3>Pack Básico</h3>
                  <p className="plan-price">Gratis</p>
                  <ul className="plan-features">
                    <li><span className="feature-icon"><FaCheck/></span> Acceso a cursos gratuitos</li>
                    <li><span className="feature-limitation"><FaTimes/></span> Límite de 3 inscripciones</li>
                    <li><span className="feature-limitation"><FaTimes/></span> Sin certificados</li>
                    <li><span className="feature-limitation"><FaTimes/></span> Con publicidad</li>
                  </ul>
                  <Link to="/register" className="btn btn-secondary">Comenzar</Link>
                </div>
                <div className="plan-card">
                  <h3>Pack Inicio</h3>
                  <p className="plan-price">$1 <span>/ mes</span></p>
                  <ul className="plan-features">
                    <li><span className="feature-icon"><FaCheck/></span> Acceso a 1 curso de pago/mes</li>
                    <li><span className="feature-icon"><FaCheck/></span> Certificado digital</li>
                    <li><span className="feature-icon"><FaCheck/></span> Sin publicidad</li>
                  </ul>
                  <Link to="/register" className="btn btn-secondary">Elegir Plan</Link>
                </div>
                <div className="plan-card highlight">
                  <h3>Pack Estudiante</h3>
                  <p className="plan-price">$5 <span>/ mes</span></p>
                  <ul className="plan-features">
                    <li><span className="feature-icon"><FaCheck/></span> Acceso a 5 cursos de pago/mes</li>
                    <li><span className="feature-icon"><FaCheck/></span> Certificado digital</li>
                    <li><span className="feature-icon"><FaCheck/></span> Sin publicidad</li>
                  </ul>
                  <Link to="/register" className="btn btn-secondary">Elegir Plan</Link>
                </div>
                <div className="plan-card">
                  <h3>Pack Premium</h3>
                  <p className="plan-price">$15 <span>/ mes</span></p>
                  <ul className="plan-features">
                    <li><span className="feature-icon"><FaCheck/></span> Acceso ILIMITADO a todo los cursos</li>
                    <li><span className="feature-icon"><FaCheck/></span> Certificado digital</li>
                    <li><span className="feature-icon"><FaCheck/></span> Sin publicidad</li>
                    <li><span className="feature-icon"><FaCheck/></span> Contenido exclusivo</li>
                  </ul>
                  <Link to="/register" className="btn btn-secondary">Elegir Plan</Link>
                </div>
              </div>
          )}

          {activePlanFilter === 'Instructor' && (
              <div className="pricing-table">
                <div className="plan-card">
                  <h3>Pack Básico</h3>
                  <p className="plan-price">Gratis</p>
                  <ul className="plan-features">
                    <li><span className="feature-icon"><FaCheck/></span> 1 Curso / 1 Sala</li>
                    <li><span className="feature-icon"><FaCheck/></span> Hasta 5 estudiantes</li>
                    <li><span className="feature-icon"><FaCheck/></span> Acceso a cursos gratuitos</li>
                    <li><span className="feature-icon"><FaCheck/></span> Analíticas básicas</li>
                  </ul>
                  <Link to="/register" className="btn btn-secondary">Comenzar</Link>
                </div>
                <div className="plan-card">
                  <h3>Pack Inicio</h3>
                  <p className="plan-price">$15 <span>/ mes</span></p>
                  <ul className="plan-features">
                    <li><span className="feature-icon"><FaCheck/></span> 2 Cursos / 2 Salas</li>
                    <li><span className="feature-icon"><FaCheck/></span> Hasta 20 estudiantes</li>
                    <li><span className="feature-icon"><FaCheck/></span> Acceso a 2 cursos de pago/mes</li>
                    <li><span className="feature-icon"><FaCheck/></span> Analíticas básicas</li>
                  </ul>
                  <Link to="/register" className="btn btn-secondary">Elegir Plan</Link>
                </div>
                <div className="plan-card highlight">
                  <h3>Pack Instructor</h3>
                  <p className="plan-price">$35 <span>/ mes</span></p>
                  <ul className="plan-features">
                    <li><span className="feature-icon"><FaCheck/></span> 10 Cursos / 5 Salas</li>
                    <li><span className="feature-icon"><FaCheck/></span> Hasta 50 estudiantes</li>
                    <li><span className="feature-icon"><FaCheck/></span> Acceso a 5 cursos de pago/mes</li>
                    <li><span className="feature-icon"><FaCheck/></span> Analíticas básicas</li>

                  </ul>
                  <Link to="/register" className="btn btn-primary">Elegir Plan </Link>
                </div>
                <div className="plan-card">
                  <h3>Pack Premium</h3>
                  <p className="plan-price">$120 <span>/ mes</span></p>
                  <ul className="plan-features">
                    <li><span className="feature-icon"><FaCheck/></span> 50 Cursos / 25 Salas</li>
                    <li><span className="feature-icon"><FaCheck/></span> Hasta 250 estudiantes</li>
                    <li><span className="feature-icon"><FaCheck/></span> Acceso ILIMITADO a todo los cursos</li>
                    <li><span className="feature-icon"><FaCheck/></span> Analíticas avanzadas</li>
                    <li><span className="feature-icon"><FaCheck/></span> Soporte por chat en vivo</li>
                  </ul>
                  <Link to="/register" className="btn btn-secondary">Elegir Plan</Link>
                </div>
                {/* <div className="plan-card">
                  <h3>Corporativo</h3>
                  <p className="plan-price">Contactar</p>
                  <ul className="plan-features">
                    <li><span className="feature-icon"><FaCheck/></span> Todo lo del plan Premium</li>
                    <li><span className="feature-icon"><FaCheck/></span> Marca blanca completa</li>
                    <li><span className="feature-icon"><FaCheck/></span> Múltiples instructores</li>
                    <li><span className="feature-icon"><FaCheck/></span> Gestor de cuenta dedicado</li>
                  </ul>
                  <Link to="/register" className="btn btn-secondary">Contactar</Link>
                </div> */}
              </div>
          )}

        </section>

        <section className="featured-courses-section">
          <h2>Explora Nuestros Cursos Públicos</h2>
          <div className="course-filters">
            <div className="filter-row">
              <div className="filter-group">
                <h4>Tipo:</h4>
                <div className="filter-buttons">
                  <button
                      onClick={() => handlePriceSelect('free')}
                      className={`filter-btn ${selectedPrice === 'free' ? 'active' : ''}`}
                  >
                    Gratis
                  </button>
                  <button
                      onClick={() => handlePriceSelect('paid')}
                      className={`filter-btn ${selectedPrice === 'paid' ? 'active' : ''}`}
                  >
                    Pago
                  </button>
                </div>
              </div>
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
            </div>
            <div className="filter-row">
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
          </div>
          <div className="course-list">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        </section>
      </div>
  );
};

export default LandingPage;