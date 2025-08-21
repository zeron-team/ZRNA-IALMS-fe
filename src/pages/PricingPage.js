import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { FaCheck, FaTimes, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';

const PricingPage = () => {
  const [activePlanFilter, setActivePlanFilter] = useState('Estudiante');

  const handlePlanFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setActivePlanFilter(newFilter);
    }
  };

  const studentPlans = [
    {
      title: 'Pack Básico',
      price: 'Gratis',
      features: [
        { text: 'Acceso a cursos gratuitos', included: true },
        { text: 'Límite de 3 inscripciones', included: false },
        { text: 'Sin certificados', included: false },
        { text: 'Con publicidad', included: false },
      ],
    },
    {
      title: 'Pack Inicio',
      price: '$1 / mes',
      features: [
        { text: 'Acceso a 1 curso de pago/mes', included: true },
        { text: 'Certificado digital', included: true },
        { text: 'Sin publicidad', included: true },
      ],
    },
    {
      title: 'Pack Estudiante',
      price: '$5 / mes',
      highlight: true,
      features: [
        { text: 'Acceso a 5 cursos de pago/mes', included: true },
        { text: 'Certificado digital', included: true },
        { text: 'Sin publicidad', included: true },
      ],
    },
    {
      title: 'Pack Premium',
      price: '$15 / mes',
      features: [
        { text: 'Acceso ILIMITADO a todo los cursos', included: true },
        { text: 'Certificado digital', included: true },
        { text: 'Sin publicidad', included: true },
        { text: 'Contenido exclusivo', included: true },
      ],
    },
  ];

  const instructorPlans = [
    {
      title: 'Pack Básico',
      price: 'Gratis',
      features: [
        { text: '1 Curso / 1 Sala', included: true },
        { text: 'Hasta 5 estudiantes', included: true },
        { text: 'Acceso a cursos gratuitos', included: true },
        { text: 'Analíticas básicas', included: true },
      ],
    },
    {
      title: 'Pack Inicio',
      price: '$15 / mes',
      features: [
        { text: '2 Cursos / 2 Salas', included: true },
        { text: 'Hasta 20 estudiantes', included: true },
        { text: 'Acceso a 2 cursos de pago/mes', included: true },
        { text: 'Analíticas básicas', included: true },
      ],
    },
    {
      title: 'Pack Instructor',
      price: '$35 / mes',
      highlight: true,
      features: [
        { text: '10 Cursos / 5 Salas', included: true },
        { text: 'Hasta 50 estudiantes', included: true },
        { text: 'Acceso a 5 cursos de pago/mes', included: true },
        { text: 'Analíticas básicas', included: true },
      ],
    },
    {
      title: 'Pack Premium',
      price: '$120 / mes',
      features: [
        { text: '50 Cursos / 25 Salas', included: true },
        { text: 'Hasta 250 estudiantes', included: true },
        { text: 'Acceso ILIMITADO a todo los cursos', included: true },
        { text: 'Analíticas avanzadas', included: true },
        { text: 'Soporte por chat en vivo', included: true },
      ],
    },
  ];

  const plans = activePlanFilter === 'Estudiante' ? studentPlans : instructorPlans;

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Un Plan para Cada Miembro de Nuestra Comunidad
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
        Elige el camino que mejor se adapte a tus objetivos, ya sea para aprender o para enseñar.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <ToggleButtonGroup
          value={activePlanFilter}
          exclusive
          onChange={handlePlanFilterChange}
          aria-label="text alignment"
        >
          <ToggleButton value="Estudiante" aria-label="left aligned">
            <FaUserGraduate style={{ marginRight: '8px' }} />
            Planes para Estudiantes
          </ToggleButton>
          <ToggleButton value="Instructor" aria-label="centered">
            <FaChalkboardTeacher style={{ marginRight: '8px' }} />
            Planes para Instructores
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={4}>
        {plans.map((plan) => (
          <Grid item key={plan.title} xs={12} sm={6} md={3}>
            <Card sx={{ border: plan.highlight ? '2px solid #556cd6' : '' }}>
              <CardContent>
                <Typography variant="h5" component="h3" align="center">
                  {plan.title}
                </Typography>
                <Typography variant="h4" align="center" sx={{ my: 2 }}>
                  {plan.price}
                </Typography>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {plan.features.map((feature) => (
                    <li key={feature.text} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      {feature.included ? (
                        <FaCheck style={{ color: 'green', marginRight: '8px' }} />
                      ) : (
                        <FaTimes style={{ color: 'red', marginRight: '8px' }} />
                      )}
                      <Typography variant="body2">{feature.text}</Typography>
                    </li>
                  ))}
                </ul>
                <Button
                  component={Link}
                  to="/register"
                  variant={plan.highlight ? 'contained' : 'outlined'}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Elegir Plan
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PricingPage;
