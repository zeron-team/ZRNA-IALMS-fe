// frontend/src/components/Layout.js

import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';

// Importa los iconos para las alertas del header
import { FaEnvelope, FaBell, FaGraduationCap, FaBullhorn } from 'react-icons/fa';

// Importa el nuevo archivo de estilos
import '../styles/Layout.css';
import '../styles/utilities.css';
import '../styles/global.css';


const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Datos de ejemplo para las notificaciones
  const notifications = [
    { name: 'Mensajes', icon: <FaEnvelope />, count: 3, color: '#3498db' },
    { name: 'Cursos', icon: <FaGraduationCap />, count: 1, color: '#2ecc71' },
    { name: 'Alertas', icon: <FaBell />, count: 5, color: '#f39c12' },
    { name: 'Anuncios', icon: <FaBullhorn />, count: 2, color: '#9b59b6' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determina si el usuario está logueado para ajustar la clase del layout
  const mainViewClass = user ? "main-view" : "main-view main-view-logged-out";

  return (
    <div className="app-container">
      {user && <Sidebar />}

      <div className={mainViewClass}>
        <header className="layout-header">
          {!user && <span className="header-title">IA LMS</span>}

          {user && (
            <div className="header-right-section">
              <div className="header-notifications">
                {notifications.map(item => (
                  <div key={item.name} className="notification-icon" title={item.name}>
                    <span style={{ color: item.color }}>{item.icon}</span>
                    {item.count > 0 && <div className="badge">{item.count}</div>}
                  </div>
                ))}
              </div>

              <div className="user-info">
                <span>Bienvenido, <strong>{user.username}</strong></span>
                <button onClick={handleLogout} className="logout-button">
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </header>

        <main className="main-content">{children}</main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;