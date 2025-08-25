import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Box, Typography, Button } from '@mui/material';
import { FaLock } from 'react-icons/fa';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  textAlign: 'center',
};

const EnrollmentModal = ({ courseId, open, onClose }) => {
  const navigate = useNavigate();

  const handleGoToCourse = () => {
    navigate(`/course/${courseId}`);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <FaLock size={40} style={{ marginBottom: 16 }} />
        <Typography variant="h6" component="h2" gutterBottom>
          Contenido Bloqueado
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Para acceder a esta lección, primero debes inscribirte en el curso.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button onClick={onClose} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleGoToCourse} variant="contained">
            Ir al Curso para Inscribirme
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EnrollmentModal;