import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth/AuthContext';
import { api } from '../services/api';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import ContactModal from './ContactModal';
import NotificationPanel from './NotificationPanel';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box } from '@mui/material';
import { FaBell, FaBars, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  const fetchNotifications = useCallback(() => {
    if (user) {
      api.getNotifications().then(setNotifications).catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (location.pathname.startsWith('/module/')) {
    return <main>{children}</main>;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const drawerWidth = 260;

  // Landing Page Layout
  if (location.pathname === '/') {
    return (
      <Box>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
              Zeron AcademIA
            </Typography>
            <Button color="inherit" component={Link} to="/login" startIcon={<FaSignInAlt />}>Iniciar Sesión</Button>
            <Button color="inherit" component={Link} to="/register" startIcon={<FaUserPlus />}>Registrarse</Button>
          </Toolbar>
        </AppBar>
        <main>{children}</main>
        <Footer />
        <WhatsAppButton onClick={() => setIsContactModalOpen(true)} />
        <ContactModal open={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
      </Box>
    );
  }

  // App Layout for logged-in users
  return (
    <Box>
      <AppBar
        position="fixed"
        sx={{
          '@media (min-width: 993px)': {
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
          }
        }}
      >
        <Toolbar>
          {user && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              sx={{ mr: 2, '@media (min-width: 993px)': { display: 'none' } }}
            >
              <FaBars />
            </IconButton>
          )}
          <Typography variant="h6" component={Link} to={user ? "/dashboard" : "/"} sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
            Zeron AcademIA
          </Typography>
          {user ? (
            <Box>
              <IconButton color="inherit" onClick={() => setIsNotificationPanelOpen(prev => !prev)}>
                <Badge badgeContent={unreadCount} color="error">
                  <FaBell />
                </Badge>
              </IconButton>
              {isNotificationPanelOpen && (
                <NotificationPanel
                  notifications={notifications}
                  onClose={() => setIsNotificationPanelOpen(false)}
                  onRefresh={fetchNotifications}
                />
              )}
              <Button color="inherit" startIcon={<FaSignOutAlt />} onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </Box>
          ) : (
            <Box>
              <Button color="inherit" component={Link} to="/login" startIcon={<FaSignInAlt />}>Iniciar Sesión</Button>
              <Button color="inherit" component={Link} to="/register" startIcon={<FaUserPlus />}>Registrarse</Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {user && <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        '@media (min-width: 993px)': {
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }
      }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: '64px', // AppBar height
          }}
        >
          {children}
        </Box>
        <Footer />
      </Box>
      <WhatsAppButton onClick={() => setIsContactModalOpen(true)} />
      <ContactModal open={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </Box>
  );
};

export default Layout;