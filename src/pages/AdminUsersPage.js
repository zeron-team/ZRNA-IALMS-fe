// frontend/src/pages/AdminUsersPage.js

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import UserFormModal from '../components/UserFormModal';
import '../styles/AdminPages.css';

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

  // --- Objeto de Opciones para el Formato de Fecha y Hora ---
  const dateTimeOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // <-- Esta es la clave para el formato de 24 horas
  };

  if (loading) return <div className="page-container"><p>Cargando usuarios...</p></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Administración de Usuarios</h1>
        <button className="btn btn-primary" onClick={handleCreate}>+ Añadir Usuario</button>
      </div>

      <div className="page-panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Última Conexión</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role.name}</td>
                  <td>
                    {user.last_login
                        // Se usan las nuevas opciones de formato
                        ? new Date(user.last_login).toLocaleString('es-AR', dateTimeOptions)
                        : 'Nunca'}
                  </td>
                  <td className="actions-cell">
                    <button onClick={() => handleEdit(user)} className="btn btn-secondary">Editar</button>
                    <button onClick={() => handleDelete(user.id, user.username)}
                            className="btn btn-danger delete">Borrar
                    </button>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

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