// frontend/src/components/Sidebar.js

import React from 'react';
import { NavLink, Link } from 'react-router-dom'; // Importa Link
import { useAuth } from '../auth/AuthContext';
import '../styles/Sidebar.css';
import {
  FaHome, FaThLarge, FaBookOpen, FaUserGraduate,
  FaUserShield, FaRoute
} from 'react-icons/fa'; // Se elimina FaUserCircle que ya no se usa aquí

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  // Se elimina "Mi Perfil" de la lista de enlaces
  const navLinks = [
    { label: 'Inicio', path: '/dashboard', icon: <FaHome />, roles: ['student', 'instructor', 'admin'] },
    { label: 'Galería de Cursos', path: '/courses', icon: <FaThLarge />, roles: ['student', 'instructor', 'admin'] },
    { label: 'Mis Cursos', path: '/my-courses', icon: <FaBookOpen />, roles: ['student'] },
    { label: 'Administrar Cursos', path: '/manage-courses', icon: <FaUserGraduate />, roles: ['instructor', 'admin'] },
    { label: 'Admin. Usuarios', path: '/admin/users', icon: <FaUserShield />, roles: ['instructor', 'admin'] },
    { label: 'Rutas de Conocimiento', path: '/learning-paths', icon: <FaRoute />, roles: ['student', 'instructor', 'admin'] },
  ];

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <Link to="/profile" className="sidebar-profile" onClick={onClose}>
          <div className="sidebar-avatar">
            <span>{user.username.charAt(0).toUpperCase()}</span>
          </div>
          <h3 className="sidebar-username">{user.profile?.first_name || user.username}</h3>
          <p className="sidebar-role">{user.role.name}</p>
        </Link>

        <nav className="sidebar-nav">
          <ul>
            {user && navLinks.map(link => (
              link.roles.includes(user.role.name) && (
                <li key={link.label}>
                  <NavLink to={link.path} onClick={onClose}>
                    {link.icon}
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              )
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;