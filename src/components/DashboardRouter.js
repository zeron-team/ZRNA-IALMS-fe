// frontend/src/components/DashboardRouter.js

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { useAuth } from '../auth/AuthContext';
import { Typography } from '@mui/material';

const DashboardRouter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  useEffect(() => {
    if (user) {
      let targetPath = '/'; // Default fallback

      switch (user.role.name) {
        case 'student':
          targetPath = '/student-dashboard';
          break;
        case 'instructor':
          targetPath = '/instructor-dashboard';
          break;
        case 'admin':
          targetPath = '/admin/dashboard';
          break;
        default:
          targetPath = '/'; // Fallback for unknown roles
      }

      // Only navigate if the current path is /dashboard
      // and the targetPath is different from the current path
      if (location.pathname === '/dashboard' && location.pathname !== targetPath) {
        navigate(targetPath);
      }
    } else {
      // This case should ideally be handled by ProtectedRoute,
      // but as a fallback, redirect to login if no user.
      navigate('/login');
    }
  }, [user, navigate, location]); // Add location to dependencies

  return (
    <Typography sx={{ textAlign: 'center', mt: 4 }}>
      Redirigiendo a tu dashboard...
    </Typography>
  );
};

export default DashboardRouter;