import React from 'react';
import { Modal, Box, Typography, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

const AuthModal = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="auth-modal-title"
      aria-describedby="auth-modal-description"
    >
      <Box sx={style}>
        <Typography id="auth-modal-title" variant="h6" component="h2" gutterBottom>
          Acceso Restringido
        </Typography>
        <Typography id="auth-modal-description" sx={{ mt: 2, mb: 3 }}>
          Debes iniciar sesión o registrarte para realizar esta acción.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" component={Link} to="/login" onClick={onClose}>
            Iniciar Sesión
          </Button>
          <Button variant="outlined" component={Link} to="/register" onClick={onClose}>
            Registrarse
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AuthModal;
