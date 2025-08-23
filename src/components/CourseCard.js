import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Typography, Box } from '@mui/material'; // Import Card, CardContent, Typography, Box
import '../styles/CourseCard.css'; // Asegúrate de que este archivo exista

const CourseCard = ({ course, children }) => {
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
    <Card className="course-card" onClick={handleCardClick} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box className="course-card-image">
        {/* --- LÓGICA DE LA ETIQUETA DE PRECIO AÑADIDA --- */}
        <div className={`price-tag ${course.price > 0 ? 'paid' : 'free'}`}>
          {course.price > 0 ? 'Pago' : 'Gratis'}
        </div>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" sx={{ fontSize: '1.1rem', fontWeight: 'bold', mb: 1 }}>{course.title}</Typography>
        <Typography variant="body2" color="text.secondary" className={isExpanded ? 'expanded' : ''}>{course.description}</Typography>
      </CardContent>
      <Box className="course-card-actions" sx={{ p: 2, pt: 0 }}>
        <Button variant="outlined" onClick={handleToggleExpand} sx={{ mr: 1 }}>
          {isExpanded ? 'Ver menos' : 'Ver más...'}
        </Button>
        {children ? children : (
          <Button variant="contained" onClick={(e) => { e.stopPropagation(); handleCardClick(); }}>
            Inscribirme
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default CourseCard;