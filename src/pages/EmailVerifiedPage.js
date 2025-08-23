// frontend/src/pages/EmailVerifiedPage.js

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Box, Typography, Container, Paper, Button } from '@mui/material';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import '../styles/InternalPageHeader.css'; // Corrected import path

const EmailVerifiedPage = () => {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      api.verifyEmail(token)
        .then(() => setStatus('success'))
        .catch(() => setStatus('error'));
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  return (
    <div className="landing-container">
      <div className="internal-hero-section"> {/* Changed class name */}
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' }, fontWeight: 'bold' }}>
            Verificación de Correo
          </Typography>
          <p>Estado de tu cuenta.</p>
        </Container>
      </div>

      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center'}}>
        <Container component="main" maxWidth="sm">
          <Paper elevation={6} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
            {status === 'verifying' && (
              <Box> {/* Wrapped content in a Box */}
                <Typography variant="h5" component="h2" gutterBottom>
                  Verificando tu cuenta...
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Por favor, espera un momento.
                </Typography>
              </Box>
            )}
            {status === 'success' && (
              <Box> {/* Wrapped content in a Box */}
                <Box sx={{ fontSize: '4rem', color: 'success.main', mb: 2 }}>
                  <FaCheckCircle />
                </Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  ¡Cuenta Verificada!
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Ya puedes iniciar sesión.
                </Typography>
                <Button component={Link} to="/login" variant="contained" size="large">
                  Iniciar Sesión
                </Button>
              </Box>
            )}
            {status === 'error' && (
              <Box> {/* Wrapped content in a Box */}
                <Box sx={{ fontSize: '4rem', color: 'error.main', mb: 2 }}>
                  <FaTimesCircle />
                </Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  Error de Verificación
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  El enlace es inválido o ha expirado.
                </Typography>
                <Button component={Link} to="/register" variant="contained" size="large" color="secondary">
                  Intentar de nuevo
                </Button>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </div>
  );
};

export default EmailVerifiedPage;