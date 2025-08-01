import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './UserFormModal.css';

const UserFormModal = ({ user, onClose, onSave }) => {
  const isEditMode = Boolean(user); // Determina si estamos en modo edición
  const [formData, setFormData] = useState({
    // Campos para creación y edición
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    role_id: user?.role?.id || 1, // Por defecto 'student'
    first_name: user?.profile?.first_name || '',
    last_name: user?.profile?.last_name || '',
  });
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // Carga los roles disponibles desde la API
    api.getRoles().then(setRoles);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditMode) {
      // Lógica de actualización (PUT)
      const payload = {
        email: formData.email,
        role_id: parseInt(formData.role_id),
        profile: {
          first_name: formData.first_name,
          last_name: formData.last_name,
        }
      };
      await api.updateUser(user.id, payload);
    } else {
      // Lógica de creación (POST)
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role_id: parseInt(formData.role_id),
      };
      await api.registerUser(payload);
    }
    onSave(); // Llama a onSave para cerrar y recargar la tabla
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{isEditMode ? `Editar Usuario: ${user.username}` : 'Crear Nuevo Usuario'}</h2>
        <form onSubmit={handleSubmit}>
          {/* Campos que solo aparecen en modo CREACIÓN */}
          {!isEditMode && (
            <>
              <label>Username</label>
              <input name="username" value={formData.username} onChange={handleChange} required />

              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </>
          )}

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Nombre</label>
          <input name="first_name" value={formData.first_name} onChange={handleChange} />

          <label>Apellido</label>
          <input name="last_name" value={formData.last_name} onChange={handleChange} />

          <label>Rol</label>
          <select name="role_id" value={formData.role_id} onChange={handleChange}>
            {roles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}
          </select>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;