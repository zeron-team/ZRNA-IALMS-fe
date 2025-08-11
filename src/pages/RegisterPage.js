// frontend/src/pages/RegisterPage.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/LoginPage.css'; // Reutilizamos estilos

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [roleName, setRoleName] = useState('student'); // <-- Estado para el rol
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await api.registerUser({ username, email, password, role_name: roleName });
      navigate('/check-email', { state: { email: response.email } });
    } catch (err) {
      setError(err.message || 'Error al registrar el usuario.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-promo">
          <h1>Únete a Zeron Academy</h1>
          <p>Elige tu camino y comienza a aprender o a enseñar hoy mismo.</p>
        </div>
        <div className="login-form-section">
          <form onSubmit={handleSubmit}>
            <h2>Crear una Cuenta</h2>

            {/* --- NUEVO SELECTOR DE ROL --- */}
            <div className="role-selector">
              <label>Quiero registrarme como:</label>
              <div>
                <button type="button"
                  className={roleName === 'student' ? 'active' : ''}
                  onClick={() => setRoleName('student')}>
                  Estudiante
                </button>
                <button type="button"
                  className={roleName === 'instructor' ? 'active' : ''}
                  onClick={() => setRoleName('instructor')}>
                  Instructor
                </button>
              </div>
            </div>

            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Nombre de usuario" required />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo electrónico" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required />
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirmar contraseña" required />

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