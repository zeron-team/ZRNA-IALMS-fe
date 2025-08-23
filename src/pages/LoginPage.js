import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Box, Typography, TextField, Button, Container, Paper, Grid, Link } from '@mui/material';
import '../styles/InternalPageHeader.css'; // Corrected import path

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password); // Call login once
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
    }
  };

  return (
    <div className="landing-container">
      <div className="internal-hero-section"> {/* Changed class name */}
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' }, fontWeight: 'bold' }}>
            Bienvenido de Vuelta
          </Typography>
          <p>Ingresa para continuar tu aprendizaje.</p>
        </Container>
      </div>

      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <Container component="main" maxWidth="lg">
          <Paper elevation={6} sx={{ display: 'flex', borderRadius: 3, overflow: 'hidden' }}>
            <Grid container>
              <Grid item xs={12} md={6} sx={{ p: { xs: 4, sm: 6 } }}>
                <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Iniciar Sesión
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                    name="password"
                    label="Contraseña"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    Ingresar
                  </Button>
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      <Link component={RouterLink} to="/register" variant="body2">
                        ¿No tienes una cuenta? Regístrate
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
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
            </Grid>
          </Paper>
        </Container>
      </Box>
    </div>
  );
};

export default LoginPage;