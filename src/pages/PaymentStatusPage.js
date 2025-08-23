//frontend/src/pages/PaymentStatusPage.js

import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { Box, Typography, Container, Paper, Button } from '@mui/material';
import '../styles/InternalPageHeader.css'; // Corrected import path

const PaymentStatusPage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');

  const statusInfo = {
    success: {
      icon: <FaCheckCircle />,
      title: "¡Pago Exitoso!",
      message: "Tu plan ha sido activado. Ya puedes disfrutar de todos los beneficios.",
      color: "success.main"
    },
    failure: {
      icon: <FaTimesCircle />,
      title: "Hubo un Problema",
      message: "No pudimos procesar tu pago. Por favor, intenta de nuevo.",
      color: "error.main"
    },
    pending: {
      icon: <FaClock />,
      title: "Pago Pendiente",
      message: "Tu pago está siendo procesado. Te notificaremos cuando se apruebe.",
      color: "warning.main"
    }
  };

  const currentStatus = statusInfo[status] || statusInfo['failure'];

  return (
    <div className="landing-container">
      <div className="internal-hero-section"> {/* Changed class name */}
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' }, fontWeight: 'bold' }}>
            Estado de tu Pago
          </Typography>
          <p>Información sobre tu transacción.</p>
        </Container>
      </div>

      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <Container component="main" maxWidth="sm">
          <Paper elevation={6} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
            <Box sx={{ fontSize: '4rem', color: currentStatus.color, mb: 2 }}>
              {currentStatus.icon}
            </Box>
            <Typography variant="h5" component="h2" gutterBottom>
              {currentStatus.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {currentStatus.message}
            </Typography>
            <Button component={Link} to="/dashboard" variant="contained" size="large">
              Ir a mi Dashboard
            </Button>
          </Paper>
        </Container>
      </Box>
    </div>
  );
};

export default PaymentStatusPage;