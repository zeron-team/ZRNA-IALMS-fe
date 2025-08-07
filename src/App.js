import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import InstructorRoute from './auth/InstructorRoute';
import AdminRoute from './auth/AdminRoute';
import Layout from './components/Layout';
import CourseList from './components/CourseList';
import CourseDetail from './components/CourseDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ModuleViewPage from './pages/ModuleViewPage';
import ManageCoursesPage from './pages/ManageCoursesPage';
import MyCoursesPage from './pages/MyCoursesPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LearningPathsPage from './pages/LearningPathsPage';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import CheckEmailPage from './pages/CheckEmailPage';
import EmailVerifiedPage from './pages/EmailVerifiedPage';
import CreateCoursePage from './pages/CreateCoursePage';
import MyRoomsPage from './pages/MyRoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import AdminUsersPage from './pages/AdminUsersPage';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/check-email" element={<CheckEmailPage />} />
            <Route path="/verify-email" element={<EmailVerifiedPage />} />
            {/* Rutas Protegidas */}
            <Route path="/dashboard" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><CourseList /></ProtectedRoute>} />
            <Route path="/course/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
            <Route path="/module/:moduleId" element={<ProtectedRoute><ModuleViewPage /></ProtectedRoute>} />
            <Route path="/my-courses" element={<ProtectedRoute><MyCoursesPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/learning-paths" element={<ProtectedRoute><LearningPathsPage /></ProtectedRoute>} />
            <Route path="/create-course" element={<ProtectedRoute><CreateCoursePage /></ProtectedRoute>} />
            <Route path="/my-rooms" element={<ProtectedRoute><MyRoomsPage /></ProtectedRoute>} />
            <Route path="/rooms/:id" element={<ProtectedRoute><RoomDetailPage /></ProtectedRoute>} />
            {/* Rutas de Admin/Instructor */}
            <Route path="/manage-courses" element={<InstructorRoute><ManageCoursesPage /></InstructorRoute>} />
            <Route path="/admin/users" element={<InstructorRoute><AdminUsersPage /></InstructorRoute>} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;