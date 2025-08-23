// frontend/src/pages/ProfilePage.js

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../auth/AuthContext';
import { FaUser } from 'react-icons/fa';
import { Box, Typography, TextField, Button, Container, Paper, Grid, Avatar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import '../styles/InternalPageHeader.css'; // Corrected import path

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    document_type: 'DNI',
    document_country: '',
    document_number: '',
    birth_date: '',
    phone_country_code: '',
    phone_number: '',
  });

  useEffect(() => {
    if (user && user.profile) {
      setFormData({
        first_name: user.profile.first_name || '',
        last_name: user.profile.last_name || '',
        document_type: user.profile.document_type || 'DNI',
        document_country: user.profile.document_country || '',
        document_number: user.profile.document_number || '',
        birth_date: user.profile.birth_date || '',
        phone_country_code: user.profile.phone_country_code || '',
        phone_number: user.profile.phone_number || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await api.updateUser(user.id, { profile: formData });
      setUser(updatedUser); 
      setIsEditing(false);
      alert('¡Perfil actualizado con éxito!');
    } catch (error) {
      alert(`Error al actualizar: ${error.message}`);
    }
  };

  if (!user) return <Typography sx={{ textAlign: 'center', mt: 4 }}>Cargando perfil...</Typography>;

  return (
    <div className="landing-container">
      <div className="internal-hero-section"> {/* Changed class name */}
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' }, fontWeight: 'bold' }}>
            Mi Perfil
          </Typography>
          <p>Gestiona tu información personal.</p>
        </Container>
      </div>

      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <Container component="main" maxWidth="md">
          <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}>
                    <FaUser size={60} />
                  </Avatar>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombres"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Apellidos"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!isEditing}>
                    <InputLabel>Tipo de Documento</InputLabel>
                    <Select
                      label="Tipo de Documento"
                      name="document_type"
                      value={formData.document_type}
                      onChange={handleChange}
                    >
                      <MenuItem value="DNI">DNI</MenuItem>
                      <MenuItem value="Pasaporte">Pasaporte</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Número de Documento"
                    name="document_number"
                    value={formData.document_number}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="País Emisor"
                    name="document_country"
                    value={formData.document_country}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Fecha de Nacimiento"
                    name="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    disabled={!isEditing}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Código de País (Teléfono)"
                    name="phone_country_code"
                    value={formData.phone_country_code}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Número de Teléfono"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                  {isEditing ? (
                    <>
                      <Button variant="outlined" onClick={() => setIsEditing(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" variant="contained">
                        Guardar Cambios
                      </Button>
                    </>
                  ) : (
                    <Button variant="contained" onClick={() => setIsEditing(true)}>
                      Editar Perfil
                    </Button>
                  )}
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>
    </div>
  );
};

export default ProfilePage;