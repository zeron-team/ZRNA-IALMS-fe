// frontend/src/pages/MyCoursesPage.js

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import StarRating from '../components/StarRating'; // <-- Importa las estrellas
import '../styles/MyCoursesPage.css';

const MyCoursesPage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyEnrolledCourses()
      .then(setEnrolledCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando tus cursos...</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Mis Cursos</h1>
      </div>
      <div className="page-panel">
        {enrolledCourses.length > 0 ? (
          <div className="my-courses-list">
            {enrolledCourses.map(course => (
              <Link to={`/course/${course.id}`} key={course.id} className="my-course-card">
                <div className="my-course-card-content">
                  {/* --- AÑADE LAS ESTRELLAS AQUÍ --- */}
                  <StarRating total={course.total_stars} earned={course.earned_stars} />
                  <h2>{course.title}</h2>
                  <p>{course.description}</p>
                </div>
                <div className="my-course-card-footer">
                  <ProgressBar percentage={course.completion_percentage} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>Aún no te has inscrito en ningún curso. ¡Explora la <Link to="/courses">galería de cursos</Link> para empezar!</p>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;