// frontend/src/components/Layout.js

import React, { useState } from 'react'; // <-- 1. Importa useState
import { useAuth } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Logo from './Logo';
import WhatsAppButton from './WhatsAppButton';
import ContactModal from './ContactModal';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- 2. DECLARA LA VARIABLE DE ESTADO ---
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const mainViewClass = user ? "main-view" : "main-view main-view-logged-out";

  return (
    <div className="app-container">
      {user && <Sidebar />}

      <div className={mainViewClass}>
        <header className="layout-header">
          <Link to={user ? "/dashboard" : "/"}>
             <Logo />
          </Link>

          {user && (
            <div className="header-user-menu">
              <div className="notification-icon">
                <FaBell />
                <div className="badge">3</div>
              </div>
              <div className="user-info">
                <FaUserCircle className="user-avatar" />
                <span>{user.username}</span>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                Cerrar Sesión
              </button>
            </div>
          )}
        </header>

        <main className="main-content">{children}</main>

        <Footer />
      </div>

      {/* --- 3. USA EL ESTADO PARA MOSTRAR/OCULTAR --- */}
      <WhatsAppButton onClick={() => setIsContactModalOpen(true)} />

      {isContactModalOpen && <ContactModal onClose={() => setIsContactModalOpen(false)} />}
    </div>
  );
};

export default Layout;