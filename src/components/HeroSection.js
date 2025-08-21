import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
} from '@mui/material';
import NeuralNetworkAnimation from './NeuralNetworkAnimation';

const HeroSection = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        py: { xs: 8, md: 12 },
        textAlign: 'center',
      }}
    >
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <NeuralNetworkAnimation />
      </Box>
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          El Futuro del Aprendizaje es Impulsado por IA
        </Typography>
        <Typography variant="h5" component="p" sx={{ mb: 4 }}>
          Nuestra plataforma crea rutas de conocimiento y cursos a tu medida, generados por inteligencia
          artificial para acelerar tu carrera profesional.
        </Typography>
        <Button variant="contained" color="secondary" size="large" component={Link} to="/register">
          Comienza a Aprender
        </Button>
      </Container>
    </Box>
  );
};

export default HeroSection;
