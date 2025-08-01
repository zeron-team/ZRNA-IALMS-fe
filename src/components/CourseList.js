// frontend/src/components/CourseList.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import SummaryModal from './SummaryModal';
import StarRating from './StarRating';
import '../styles/CourseList.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({
    isOpen: false,
    content: '',
    title: '',
    isLoading: false,
  });
  const navigate = useNavigate();

  const fetchCourses = () => {
    setLoading(true);
    api.getCourses()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

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

  if (loading) return <p>Cargando cursos...</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Catálogo de Cursos</h1>
      </div>
      <div className="course-list">
        {courses.map(course => (
          <div key={course.id} className="course-card" onClick={() => navigate(`/course/${course.id}`)}>
            <div className="course-card-image"></div>
            <div className="course-card-content">
              <div className="course-card-tags">
                <span className="tag-category">{course.category?.name || 'General'}</span>
                <span className={`tag-level level-${course.level}`}>{course.level}</span>
              </div>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <StarRating total={course.total_stars} earned={course.earned_stars} />
            </div>
            <div className="course-card-actions">
              <button className="btn btn-secondary" onClick={(e) => handleSeeMore(e, course)}>Ver más...</button>
              <button className="btn btn-primary" onClick={(e) => handleEnroll(e, course.id, course.title)}>Inscribirme</button>
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
  );
};

export default CourseList;