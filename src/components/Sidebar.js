// frontend/src/components/Sidebar.js

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../styles/Sidebar.css';

// 1. Importa el nuevo icono para 'Inicio'
import {
  FaHome, // <-- Icono para Inicio
  FaThLarge,
  FaBookOpen,
  FaUserGraduate,
  FaUserShield,
  FaUserCircle,
  FaTachometerAlt,
  FaRoute
} from 'react-icons/fa';

const Sidebar = () => {
  const { user } = useAuth();

  // 2. Modifica el array de enlaces
  const navLinks = [
    { label: 'Inicio', path: '/', icon: <FaHome />, roles: ['student', 'instructor', 'admin'] },
    { label: 'Galería de Cursos', path: '/courses', icon: <FaThLarge />, roles: ['student', 'instructor', 'admin'] },
    { label: 'Mis Cursos', path: '/my-courses', icon: <FaBookOpen />, roles: ['student'] },
    { label: 'Administrar Cursos', path: '/manage-courses', icon: <FaUserGraduate />, roles: ['instructor', 'admin'] },
    { label: 'Admin. Usuarios', path: '/admin/users', icon: <FaUserShield />, roles: ['instructor', 'admin'] },
    { label: 'Mi Perfil', path: '/profile', icon: <FaUserCircle />, roles: ['student', 'instructor', 'admin'] },
    { label: 'Dashboard Admin', path: '/admin/dashboard', icon: <FaTachometerAlt />, roles: ['admin'] },
    { label: 'Rutas de Conocimiento', path: '/learning-paths', icon: <FaRoute />, roles: ['student', 'instructor', 'admin'] },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">IA LMS</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {user && navLinks.map(link => (
            link.roles.includes(user.role.name) && (
              <li key={link.label}>
                <NavLink to={link.path}>
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              </li>
            )
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;