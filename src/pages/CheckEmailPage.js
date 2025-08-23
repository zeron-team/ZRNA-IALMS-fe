// frontend/src/pages/CheckEmailPage.js

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa';
import { Box, Typography, Container, Paper, Button } from '@mui/material';
import '../styles/InternalPageHeader.css'; // Corrected import path

const CheckEmailPage = () => {
  const location = useLocation();
  const email = location.state?.email;

  return (
    <div className="landing-container">
      <div className="internal-hero-section"> {/* Changed class name */}
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' }, fontWeight: 'bold' }}>
            ¡Revisa tu Correo!
          </Typography>
          <p>Hemos enviado un enlace de activación.</p>
        </Container>
      </div>

      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <Container component="main" maxWidth="sm">
          <Paper elevation={6} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
            <Box sx={{ fontSize: '4rem', color: 'primary.main', mb: 2 }}>
              <FaPaperPlane />
            </Box>
            <Typography variant="h5" component="h2" gutterBottom>
              ¡Revisa tu Correo!
            </Typography>

            {email ? (
              <Typography variant="body1" sx={{ mb: 2 }}>
                Hemos enviado un enlace de activación a <strong>{email}</strong>.
              </Typography>
            ) : (
              <Typography variant="body1" sx={{ mb: 2 }}>
                Hemos enviado un enlace de activación a tu correo electrónico.
              </Typography>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Si no lo encuentras en tu bandeja de entrada, por favor, revisa tu carpeta de spam.
            </Typography>
            <Button component={Link} to="/login" variant="contained" size="large">
              Volver a Inicio
            </Button>
          </Paper>
        </Container>
      </Box>
    </div>
  );
};

export default CheckEmailPage;