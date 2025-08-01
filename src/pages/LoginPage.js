import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../styles/LoginPage.css'

const LoginPage = () => {
  const [username, setUsername] = useState('instructor_pro'); // Precargado para pruebas
  const [password, setPassword] = useState('admin123');     // Precargado para pruebas
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-promo">
          <h1>Plataforma de Aprendizaje IA</h1>
          <p>Potencia tu conocimiento con cursos generados y asistidos por Inteligencia Artificial.</p>
        </div>
        <div className="login-form-section">
          <form onSubmit={handleSubmit}>
            <h2>Bienvenido de Vuelta</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nombre de usuario"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Ingresar</button>
            <p className="register-link">
              ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;