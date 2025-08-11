// frontend/src/components/CourseList.js

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../auth/AuthContext';
import SummaryModal from '../components/SummaryModal';
import StarRating from '../components/StarRating';
import '../styles/CourseList.css';

const CourseList = () => {
  const { user } = useAuth();
  const [allCourses, setAllCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({ isOpen: false, content: '', title: '', isLoading: false });
  const navigate = useNavigate();

  // --- ESTADOS PARA LOS FILTROS ---
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null); // <-- Nuevo estado para el filtro de precio

  const fetchCourses = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.getCourses(),
      api.getCategories()
    ]).then(([courseData, categoryData]) => {
      setAllCourses(courseData);
      setCategories(categoryData);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleLevelSelect = (level) => {
    setSelectedLevel(prev => prev === level ? null : level);
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Nueva función para manejar el filtro de precio
  const handlePriceSelect = (priceType) => {
    setSelectedPrice(prev => prev === priceType ? null : priceType);
  };

  // Lógica de filtrado actualizada
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

  const handleEnroll = async (e, courseId, courseTitle) => {
    e.stopPropagation();
    try {
      await api.enrollInCourse(courseId);
      alert(`¡Te has inscrito en "${courseTitle}" con éxito!`);
      fetchCourses();
    } catch (error) {
      alert(`Error al inscribirte: ${error.message}`);
    }
  };

  const handleSeeMore = async (e, course) => {
    e.stopPropagation();
    setModalState({ isOpen: true, isLoading: true, title: course.title, content: '' });
    try {
      const summary = await api.getCourseSummary(course.id);
      setModalState(prev => ({ ...prev, content: summary, isLoading: false }));
    } catch (error) {
      setModalState(prev => ({ ...prev, content: 'No se pudo cargar el resumen.', isLoading: false }));
    }
  };

  const closeModal = () => setModalState({ isOpen: false, content: '', title: '', isLoading: false });

  if (loading) return <div className="page-container"><p>Cargando cursos...</p></div>;

  const userPlan = user?.plan || 'Estudiante Básico';

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Catálogo de Cursos</h1>
      </div>

      <div className="page-panel course-filters">
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
              <div key={course.id} className="course-card" onClick={() => navigate(`/course/${course.id}`)}>
                <div className="course-card-image">
                  <div className={`price-tag ${course.price > 0 ? 'paid' : 'free'}`}>
                    {course.price > 0 ? 'Pago' : 'Gratis'}
                  </div>
                </div>
                <div className="course-card-content">
                  <div className="course-card-tags">
                    <span className="tag-category">{course.category?.name || 'General'}</span>
                    <span className={`tag-level level-${course.level}`}>{course.level}</span>
                  </div>
                  <h2>{course.title}</h2>
                  <p>{course.description}</p>
                  <StarRating total={course.total_stars} earned={course.earned_stars}/>
                </div>
                <div className="course-card-actions">
                  <button className="btn btn-secondary" onClick={(e) => handleSeeMore(e, course)}>Ver más...</button>
                  <button
                      className="btn btn-primary"
                      onClick={(e) => handleEnroll(e, course.id, course.title)}
                      disabled={userPlan === 'Estudiante Básico' && course.price > 0}
                  >
                    Inscribirme
                  </button>
                </div>
              </div>
          ))}
        </div>

        {modalState.isOpen && (
            <SummaryModal
                title={modalState.title}
                content={modalState.content}
                isLoading={modalState.isLoading}
                onClose={closeModal}
            />
        )}
      </div>
      </div>
      );
      };

      export default CourseList;