// frontend/src/pages/RegisterPage.js

import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { api } from '../services/api';
import { Box, Typography, TextField, Button, Container, Paper, Grid, Link, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
import '../styles/InternalPageHeader.css'; // Corrected import path

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [roleName, setRoleName] = useState('student');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await api.registerUser({ username, email, password, role_name: roleName });
      navigate('/check-email', { state: { email: response.email } });
    } catch (err) {
      setError(err.message || 'Error al registrar el usuario.');
    }
  };

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setRoleName(newRole);
    }
  };

  return (
    <div className="landing-container">
      <div className="internal-hero-section"> {/* Changed class name */}
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' }, fontWeight: 'bold' }}>
            Únete a Nuestra Comunidad
          </Typography>
          <p>Elige tu camino y comienza a aprender o a enseñar hoy mismo.</p>
        </Container>
      </div>

      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <Container component="main" maxWidth="lg">
          <Paper elevation={6} sx={{ display: 'flex', borderRadius: 3, overflow: 'hidden' }}>
            <Grid container>
              <Grid 
                item 
                xs={false} 
                md={6} 
                sx={{ 
                  display: { xs: 'none', md: 'flex' },
                  flexDirection: 'column',
                  justifyContent: 'center', 
                  p: 6, 
                  color: 'common.white', 
                  background: 'linear-gradient(45deg, #111827, var(--accent))' 
                }}
              >
                <Typography component="h1" variant="h3" sx={{ fontWeight: 'bold' }}>
                  Plataforma de Aprendizaje IA
                </Typography>
                <Typography variant="h6" sx={{ mt: 2, opacity: 0.9 }}>
                  Potencia tu conocimiento con cursos generados y asistidos por Inteligencia Artificial.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ p: { xs: 4, sm: 6 } }}>
                <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Crear una Cuenta
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>Quiero registrarme como:</Typography>
                    <ToggleButtonGroup
                      value={roleName}
                      exclusive
                      onChange={handleRoleChange}
                      fullWidth
                    >
                      <ToggleButton value="student">
                        <FaUserGraduate style={{ marginRight: '8px' }} />
                        Estudiante
                      </ToggleButton>
                      <ToggleButton value="instructor">
                        <FaChalkboardTeacher style={{ marginRight: '8px' }} />
                        Instructor
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Nombre de usuario"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Correo electrónico"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Contraseña"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirmar contraseña"
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  {error && (
                    <Typography color="error" align="center" sx={{ mt: 2 }}>
                      {error}
                    </Typography>
                  )}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Crear Cuenta
                  </Button>
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      <Link component={RouterLink} to="/login" variant="body2">
                        ¿Ya tienes una cuenta? Inicia Sesión
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </div>
  );
};

export default RegisterPage;