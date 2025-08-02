// frontend/src/pages/ProfilePage.js

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../auth/AuthContext';
import { FaUser } from 'react-icons/fa';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // --- CORRECCIÓN AQUÍ: Inicializa todos los campos ---
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
    // Cuando el usuario se carga, llena el formulario con los datos existentes
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
      setUser(updatedUser); // Actualiza el usuario en el contexto global
      setIsEditing(false);
      alert('¡Perfil actualizado con éxito!');
    } catch (error) {
      alert(`Error al actualizar: ${error.message}`);
    }
  };

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Mi Perfil</h1>
      </div>
      <div className="page-panel">
        <form onSubmit={handleSubmit}>
          <div className="profile-grid">
            <div className="profile-avatar-section">
              <div className="profile-avatar"><FaUser /></div>
              {/* Lógica para subir foto podría ir aquí */}
            </div>

            <div className="profile-details-section">
              <div className="form-grid">
                {/* Nombres */}
                <div className="form-group">
                  <label>Nombres</label>
                  <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} disabled={!isEditing} />
                </div>
                {/* Apellidos */}
                <div className="form-group">
                  <label>Apellidos</label>
                  <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} disabled={!isEditing} />
                </div>
                {/* Tipo de Documento */}
                <div className="form-group">
                  <label>Tipo de Documento</label>
                  <select name="document_type" value={formData.document_type} onChange={handleChange} disabled={!isEditing}>
                    <option value="DNI">DNI</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                </div>
                {/* Número de Documento */}
                <div className="form-group">
                  <label>Número de Documento</label>
                  <input type="text" name="document_number" value={formData.document_number} onChange={handleChange} disabled={!isEditing} />
                </div>
                 {/* País Emisor */}
                <div className="form-group">
                  <label>País Emisor</label>
                  <input type="text" name="document_country" value={formData.document_country} onChange={handleChange} disabled={!isEditing} />
                </div>
                {/* Fecha de Nacimiento */}
                <div className="form-group">
                  <label>Fecha de Nacimiento</label>
                  <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} disabled={!isEditing} />
                </div>
                {/* Teléfono Celular */}
                <div className="form-group" style={{gridColumn: 'span 2'}}>
                  <label>Teléfono Celular</label>
                  <div className="phone-group">
                    <input type="text" name="phone_country_code" value={formData.phone_country_code} onChange={handleChange} placeholder="+54" disabled={!isEditing} />
                    <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="911..." disabled={!isEditing} />
                  </div>
                </div>
              </div>
              <div className="profile-actions">
                {isEditing ? (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                  </>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>Editar Perfil</button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;