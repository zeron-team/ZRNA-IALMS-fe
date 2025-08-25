import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { FaCheck, FaLock, FaInstagram, FaLinkedinIn, FaWhatsapp, FaTwitter, FaTelegramPlane, FaDiscord } from 'react-icons/fa';
import { useAuth } from '../auth/AuthContext';
import { Button, Card, CardContent, Typography, Box, IconButton } from '@mui/material';

const CourseDetail = () => {
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { id } = useParams();

  const fetchDetails = useCallback(() => {
    if (!id || isNaN(parseInt(id))) {
      setLoading(false); return;
    }
    setLoading(true);
    api.getCourseDetail(id)
      .then(data => setCourse(data))
      .catch(error => console.error("Error al obtener detalles:", error))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  const handleGenerateCurriculum = async () => {
    setIsGenerating(true);
    try {
      await api.generateCurriculum(id);
      fetchDetails(); // Recarga los detalles para mostrar los nuevos módulos
    } catch (error) {
      alert("Hubo un error al generar la currícula.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <div className="page-container"><p>Cargando detalles del curso...</p></div>;
  if (!course) return <div className="page-container"><p>Curso no encontrado.</p></div>;

  const canEdit = user && (
    user.role.name === 'admin' ||
    user.role.name === 'instructor' ||
    user.id === course.creator_id
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{course.title}</h1>
        <Button component={Link} to="/courses" variant="outlined">&larr; Volver al Catálogo</Button>
      </div>
      <div className="page-panel course-detail-panel">
        <p className="course-description">{course.description}</p>

<Box sx={{ mt: 2, mb: 3 }}>
  <Typography variant="h6" component="h4" gutterBottom>Compartir Curso:</Typography>
  <Box sx={{ display: 'flex', gap: 1 }}>
    {/* LinkedIn */}
    <IconButton
      aria-label="Compartir en LinkedIn"
      onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(course.title)}&summary=${encodeURIComponent(course.description)}&source=${encodeURIComponent('Zeron AcademIA')}`, '_blank')}
    >
      <FaLinkedinIn size={24} />
    </IconButton>
    {/* WhatsApp */}
    <IconButton
      aria-label="Compartir en WhatsApp"
      onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`¡Mira este curso en Zeron AcademIA: ${course.title}! ${window.location.href}`)}`, '_blank')}
    >
      <FaWhatsapp size={24} />
    </IconButton>
    {/* X (Twitter) */}
    <IconButton
      aria-label="Compartir en X (Twitter)"
      onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`¡Aprende ${course.title} en Zeron AcademIA!`)}`, '_blank')}
    >
      <FaTwitter size={24} />
    </IconButton>
    {/* Telegram */}
    <IconButton
      aria-label="Compartir en Telegram"
      onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`¡Mira este curso en Zeron AcademIA: ${course.title}!`)}`, '_blank')}
    >
      <FaTelegramPlane size={24} />
    </IconButton>
    {/* Instagram (link to profile as direct sharing is not feasible) */}
    <IconButton
      aria-label="Visitar Instagram"
      onClick={() => window.open('https://www.instagram.com/zeronacademy/', '_blank')} // Replace with actual Instagram profile URL
    >
      <FaInstagram size={24} />
    </IconButton>
    {/* Discord (link to server as direct sharing is not feasible) */}
    <IconButton
      aria-label="Unirse a Discord"
      onClick={() => window.open('https://discord.gg/your-discord-invite', '_blank')} // Replace with actual Discord invite link
    >
      <FaDiscord size={24} />
    </IconButton>
  </Box>
</Box>
        <h3 className="curriculum-header">Currícula del Curso</h3>

        {course.modules && course.modules.length > 0 ? (
          <div className="curriculum-list">
            {course.modules.map(module => (
              <div key={module.id} className={`module-step ${module.status} ${module.is_locked ? 'locked' : ''}`}>
                <div className="module-step-indicator">
                  <div className="indicator-circle">
                    {module.is_locked ? <FaLock /> : (
                      module.status === 'completed' ? <FaCheck /> : <span>{String(module.order_index).padStart(2, '0')}</span>
                    )}
                  </div>
                  <div className="indicator-line"></div>
                </div>
                <div className="module-step-content page-panel">
                  <h4>{module.title}</h4>
                  <p>{module.description}</p>
                  {!module.is_locked ? (
                    <Button component={Link} to={`/module/${module.id}`} variant="outlined">
                      {module.status === 'completed' ? 'Revisar Módulo' : 'Empezar Módulo'}
                    </Button>
                  ) : (
                    <Button variant="outlined" disabled>Bloqueado</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="curriculum-generator">
            <p>Este curso aún no tiene una currícula definida.</p>
            {canEdit && (
              <Button onClick={handleGenerateCurriculum} disabled={isGenerating} variant="contained">
                {isGenerating ? 'Generando...' : '✨ Generar Currícula con IA'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;