import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material'; // Import Button from Material UI
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
        <Button variant="outlined" onClick={handleToggleExpand} sx={{ mr: 1 }}>
          {isExpanded ? 'Ver menos' : 'Ver más...'}
        </Button>
        <Button variant="contained" onClick={(e) => { e.stopPropagation(); handleCardClick(); }}>
          Inscribirme
        </Button>
      </div>
    </div>
  );
};

export default CourseCard;