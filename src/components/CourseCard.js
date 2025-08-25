import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Typography, Box, IconButton } from '@mui/material'; // Import Card, CardContent, Typography, Box
import { FaInstagram, FaLinkedinIn, FaWhatsapp, FaTwitter, FaTelegramPlane, FaDiscord } from 'react-icons/fa';
import ProgressBar from './ProgressBar';
import '../styles/CourseCard.css'; // Asegúrate de que este archivo exista

const CourseCard = ({ course, children, showEnterButton = false, progress = null }) => {
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
        <Typography variant="body2" color="text.secondary" component="p" className={isExpanded ? 'expanded' : ''}>{course.description}</Typography>
        {progress !== null && (
          <Box sx={{ mt: 2 }}>
            <ProgressBar percentage={progress} />
          </Box>
        )}
      </CardContent>
      <Box className="course-card-actions" sx={{ p: 2, pt: 0 }}>
        {showEnterButton ? (
          <Button variant="contained" fullWidth onClick={(e) => { e.stopPropagation(); handleCardClick(); }}>
            Ingresar
          </Button>
        ) : (
          <>
            <Button variant="outlined" onClick={handleToggleExpand} sx={{ mr: 1 }}>
              {isExpanded ? 'Ver menos' : 'Ver más'}
            </Button>
            {children ? children : (
              <Button variant="contained" onClick={(e) => { e.stopPropagation(); handleCardClick(); }}>
                Inscribirme
              </Button>
            )}
          </>
        )}
      </Box>

      <Box sx={{ p: 2, pt: 0 }}>
        <Typography variant="body2" gutterBottom>Compartir:</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* LinkedIn */}
          <IconButton
            aria-label="Compartir en LinkedIn"
            onClick={(e) => { e.stopPropagation(); window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`${window.location.origin}/course/${course.id}`)}&title=${encodeURIComponent(course.title)}&summary=${encodeURIComponent(course.description)}&source=${encodeURIComponent('Zeron AcademIA')}`, '_blank'); }}
            size="small"
          >
            <FaLinkedinIn size={18} />
          </IconButton>
          {/* WhatsApp */}
          <IconButton
            aria-label="Compartir en WhatsApp"
            onClick={(e) => { e.stopPropagation(); window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`¡Mira este curso en Zeron AcademIA: ${course.title}! ${window.location.origin}/course/${course.id}`)}`, '_blank'); }}
            size="small"
          >
            <FaWhatsapp size={18} />
          </IconButton>
          {/* X (Twitter) */}
          <IconButton
            aria-label="Compartir en X (Twitter)"
            onClick={(e) => { e.stopPropagation(); window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${window.location.origin}/course/${course.id}`)}&text=${encodeURIComponent(`¡Aprende ${course.title} en Zeron AcademIA!`)}`, '_blank'); }}
            size="small"
          >
            <FaTwitter size={18} />
          </IconButton>
          {/* Telegram */}
          <IconButton
            aria-label="Compartir en Telegram"
            onClick={(e) => { e.stopPropagation(); window.open(`https://t.me/share/url?url=${encodeURIComponent(`${window.location.origin}/course/${course.id}`)}&text=${encodeURIComponent(`¡Mira este curso en Zeron AcademIA: ${course.title}!`)}`, '_blank'); }}
            size="small"
          >
            <FaTelegramPlane size={18} />
          </IconButton>
          {/* Instagram (link to profile as direct sharing is not feasible) */}
          <IconButton
            aria-label="Visitar Instagram"
            onClick={(e) => { e.stopPropagation(); window.open('https://www.instagram.com/zeronacademy/', '_blank'); }} // Replace with actual Instagram profile URL
            size="small"
          >
            <FaInstagram size={18} />
          </IconButton>
          {/* Discord (link to server as direct sharing is not feasible) */}
          <IconButton
            aria-label="Unirse a Discord"
            onClick={(e) => { e.stopPropagation(); window.open('https://discord.gg/your-discord-invite', '_blank'); }} // Replace with actual Discord invite link
            size="small"
          >
            <FaDiscord size={18} />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default CourseCard;