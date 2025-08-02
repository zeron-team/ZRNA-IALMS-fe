// frontend/src/pages/RegisterPage.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/LoginPage.css'; // Asegúrate de que este archivo esté en la misma carpeta 'pages'

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación de contraseñas
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      // El backend asignará el rol de 'student' y lo creará como inactivo
      const response = await api.registerUser({ username, email, password });

      // Redirige a la página "Revisa tu correo", pasándole el email
      navigate('/check-email', { state: { email: response.email } });

    } catch (err) {
      setError(err.message || 'Error al registrar el usuario.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-promo">
          <h1>Únete a Nuestra Comunidad</h1>
          <p>Comienza tu viaje de aprendizaje hoy mismo, impulsado por IA.</p>
        </div>
        <div className="login-form-section">
          <form onSubmit={handleSubmit}>
            <h2>Crear una Cuenta</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nombre de usuario"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
              required
            />

            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="btn btn-primary">Crear Cuenta</button>
            <p className="register-link">
              ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;