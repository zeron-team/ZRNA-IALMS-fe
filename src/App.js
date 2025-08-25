import React from 'react';
import { Helmet } from 'react-helmet';
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
import LandingPage from './pages/LandingPage';
import CheckEmailPage from './pages/CheckEmailPage';
import EmailVerifiedPage from './pages/EmailVerifiedPage';
import CreateCoursePage from './pages/CreateCoursePage';
import MyRoomsPage from './pages/MyRoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import AdminUsersPage from './pages/AdminUsersPage';
import PaymentStatusPage from './pages/PaymentStatusPage';
import DashboardRouter from './components/DashboardRouter';
import StudentDashboardPage from './pages/StudentDashboardPage';
import InstructorDashboardPage from './pages/InstructorDashboardPage'; // Added import

// Import ThemeProvider and theme
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; // Assuming theme.js is in the same directory

function App() {
  return (
        <>
        <Helmet>
        <title>Zeron AcademIA | El Futuro del Aprendizaje con IA</title>
        <meta name="description" content="Acelera tu carrera profesional con cursos y rutas de conocimiento generados por Inteligencia Artificial. Aprende sobre Desarrollo, DevOps, IA, Blockchain y más." />
    </Helmet>
    <AuthProvider>
      <ThemeProvider theme={theme}> {/* Wrap with ThemeProvider */}
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Layout>
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/check-email" element={<CheckEmailPage />} />
              <Route path="/verify-email" element={<EmailVerifiedPage />} />
              {/* Rutas Protegidas */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
              <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboardPage /></ProtectedRoute>} />
              <Route path="/instructor-dashboard" element={<ProtectedRoute><InstructorDashboardPage /></ProtectedRoute>} /> {/* New Instructor Dashboard Route */}
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
              <Route path="/payment-status" element={<PaymentStatusPage />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
    </>
  );
}

export default App;