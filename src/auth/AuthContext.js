/* frontend/src/auth/  */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getCurrentUser()
        .then(userData => setUser(userData))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const data = await api.login(username, password);
    localStorage.setItem('token', data.access_token);
    const userData = await api.getCurrentUser();
    setUser(userData);
    return userData;
  };

  // --- ESTA ES LA FUNCIÓN IMPORTANTE ---
  const logout = () => {
    setUser(null); // Limpia el usuario del estado de React
    localStorage.removeItem('token'); // Elimina el token del navegador
    // Opcional: podrías redirigir al login aquí con `Maps('/login')`
  };

  const authValue = { user, login, logout };

  if (loading) {
    return <p>Cargando aplicación...</p>;
  }

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};