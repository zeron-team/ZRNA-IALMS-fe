import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { FaUser } from 'react-icons/fa'; // Icono para el avatar

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return <p>Cargando información del perfil...</p>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Mi Perfil</h1>
      </div>
      <div className="page-panel">
        <div className="profile-layout">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <FaUser />
            </div>
            <button>Cambiar Foto</button>
          </div>
          <div className="profile-details-section">
            <h2>{user.profile?.first_name || 'Nombre no especificado'} {user.profile?.last_name}</h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rol:</strong> {user.role.name}</p>
            <hr />
            <h3>Biografía</h3>
            <p>{user.profile?.bio || 'Aún no has añadido una biografía.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;