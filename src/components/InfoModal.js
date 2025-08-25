import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { FaExclamationTriangle } from 'react-icons/fa';

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

const InfoModal = ({ open, onClose, title, message }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <FaExclamationTriangle size={40} style={{ marginBottom: 16, color: 'orange' }} />
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <Typography sx={{ mb: 2 }}>
          {message}
        </Typography>
        <Button onClick={onClose} variant="contained">
          Entendido
        </Button>
      </Box>
    </Modal>
  );
};

export default InfoModal;