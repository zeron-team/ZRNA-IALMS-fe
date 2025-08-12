import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CourseCard.css'; // Asegúrate de que este archivo exista

const CourseCard = ({ course }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleToggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleCardClick = () => {
    navigate(`/course/${course.id}`); // Llevamos al detalle del curso
  };

  return (
    <div className="course-card" onClick={handleCardClick}>
      <div className="course-card-image">
        {/* --- LÓGICA DE LA ETIQUETA DE PRECIO AÑADIDA --- */}
        <div className={`price-tag ${course.price > 0 ? 'paid' : 'free'}`}>
          {course.price > 0 ? 'Pago' : 'Gratis'}
        </div>
      </div>
      <div className="course-card-content">
        <h2>{course.title}</h2>
        <p className={isExpanded ? 'expanded' : ''}>{course.description}</p>
      </div>
      <div className="course-card-actions">
        <button className="btn btn-secondary" onClick={handleToggleExpand}>
          {isExpanded ? 'Ver menos' : 'Ver más...'}
        </button>
        <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); handleCardClick(); }}>
          Inscribirme
        </button>
      </div>
    </div>
  );
};

export default CourseCard;