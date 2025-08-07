// frontend/src/components/Layout.js

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth/AuthContext';
import { api } from '../services/api';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import ContactModal from './ContactModal';
import NotificationPanel from './NotificationPanel';
import { FaBell, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  // Se envuelve en useCallback para evitar re-creaciones innecesarias
  const fetchNotifications = useCallback(() => {
    if (user) {
      api.getNotifications().then(setNotifications).catch(console.error);
    }
  }, [user]);

  // Se añade la dependencia que faltaba para corregir el warning
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Esta lógica oculta el Layout principal en la vista de lección
  if (location.pathname.startsWith('/module/')) {
    return <main>{children}</main>;
  }

  // Se define la función handleLogout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const mainViewClass = user ? "main-view" : "main-view main-view-logged-out";
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="app-container">
      {user && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      <div className={mainViewClass}>
        <header className="layout-header">
          <div className="header-left">
            {user && (
              <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
                <FaBars />
              </button>
            )}
            <Link to={user ? "/dashboard" : "/"} className="header-brand-text">
               Zeron Academy
            </Link>
          </div>
          {user ? (
            <div className="header-user-menu">
              <div
                className="notification-icon"
                title="Notificaciones"
                onClick={() => setIsNotificationPanelOpen(prev => !prev)}
              >
                <FaBell />
                {unreadCount > 0 && <div className="badge">{unreadCount}</div>}
              </div>
              {isNotificationPanelOpen && (
                <NotificationPanel
                  notifications={notifications}
                  onClose={() => setIsNotificationPanelOpen(false)}
                  onRefresh={fetchNotifications}
                />
              )}
              <button onClick={handleLogout} className="btn-logout">
                <FaSignOutAlt />
                <span className="logout-text">Cerrar Sesión</span>
              </button>
            </div>
          ) : (
            <>
              <div className="header-public-menu">
                <Link to="/login" className="btn btn-secondary">Iniciar Sesión</Link>
                <Link to="/register" className="btn btn-primary">Registrarse</Link>
              </div>
              <button className="hamburger-btn public" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </>
          )}
        </header>
        {!user && isMobileMenuOpen && (
          <div className="mobile-menu">
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Iniciar Sesión</Link>
            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Registrarse</Link>
          </div>
        )}
        <main className="main-content">{children}</main>
        <Footer />
      </div>
      <WhatsAppButton onClick={() => setIsContactModalOpen(true)} />
      {isContactModalOpen && <ContactModal onClose={() => setIsContactModalOpen(false)} />}
    </div>
  );
};

export default Layout;