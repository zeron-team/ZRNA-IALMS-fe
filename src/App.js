// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Contexto y Rutas Protegidas ---
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import InstructorRoute from './auth/InstructorRoute';
import AdminRoute from './auth/AdminRoute';

// --- Componentes y Páginas ---
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CourseDetail from './components/CourseDetail';
import CourseList from './components/CourseList';
import ModuleViewPage from './pages/ModuleViewPage';
import ManageCoursesPage from './pages/ManageCoursesPage';
import AdminUsersPage from './pages/AdminUsersPage';
import MyCoursesPage from './pages/MyCoursesPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LearningPathsPage from './pages/LearningPathsPage';
import HomePage from './pages/HomePage'; // <-- Componente principal para "/"

//import './App_old.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* --- Rutas Protegidas --- */}

            {/* La ruta principal AHORA es el 'Inicio' (Dashboard o Galería para Admins) */}
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

            {/* 2. Se añade la nueva ruta para la Galería de Cursos */}
            <Route path="/courses" element={<ProtectedRoute><CourseList /></ProtectedRoute>} />

            <Route path="/course/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
            <Route path="/module/:moduleId" element={<ProtectedRoute><ModuleViewPage /></ProtectedRoute>} />
            <Route path="/my-courses" element={<ProtectedRoute><MyCoursesPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/learning-paths" element={<ProtectedRoute><LearningPathsPage /></ProtectedRoute>} />

            {/* Rutas para Instructores y Admins */}
            <Route path="/manage-courses" element={<InstructorRoute><ManageCoursesPage /></InstructorRoute>} />
            <Route path="/admin/users" element={<InstructorRoute><AdminUsersPage /></InstructorRoute>} />

            {/* Rutas solo para Admins */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;