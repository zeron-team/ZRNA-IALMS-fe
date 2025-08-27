// frontend/src/pages/AdminUsersPage.js

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import UserFormModal from '../components/UserFormModal';
import { Box, Typography, Container, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { FaPlusCircle } from 'react-icons/fa';
import '../styles/InternalPageHeader.css'; // Corrected import path

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    api.getUsers().then(setUsers).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId, username) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${username}"?`)) {
      try {
        await api.deleteUser(userId);
        alert('Usuario eliminado.');
        fetchUsers();
      } catch (err) {
        alert(`Error al eliminar: ${err.message}`);
      }
    }
  };

  const handleSaveUser = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    fetchUsers();
  };

  const dateTimeOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  if (loading) return <Typography sx={{ textAlign: 'center', mt: 4 }}>Cargando usuarios...</Typography>;

  return (
    <div className="landing-container">
      <div className="internal-hero-section"> {/* Changed class name */}
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' }, fontWeight: 'bold' }}>
            Administración de Usuarios
          </Typography>
          <p>Gestiona los usuarios de la plataforma.</p>
          <Button
            variant="contained"
            size="large"
            className="cta-button"
            startIcon={<FaPlusCircle />}
            onClick={handleCreate}
          >
            Añadir Usuario
          </Button>
        </Container>
      </div>

      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Rol</TableCell>
                    <TableCell>Última Conexión</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role.name}</TableCell>
                      <TableCell>
                        {user.last_login
                          ? new Date(user.last_login).toLocaleString('es-AR', dateTimeOptions)
                          : 'Nunca'}
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleEdit(user)} variant="outlined" size="small" sx={{ mr: 1 }}>Editar</Button>
                        <Button onClick={() => handleDelete(user.id, user.username)} variant="outlined" size="small" color="error">Borrar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>

      {isModalOpen && (
        <UserFormModal
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default AdminUsersPage;