import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/LoginPage.css'; // Reutilizamos los estilos del Login para consistencia

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    try {
      await api.registerUser({ username, email, password, role: 'student' });
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Error al registrar el usuario.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-promo">
          <h1>Únete a Nuestra Comunidad</h1>
          <p>Comienza tu viaje de aprendizaje hoy mismo. Accede a cursos de vanguardia y lleva tus habilidades al siguiente nivel.</p>
        </div>
        <div className="login-form-section">
          <form onSubmit={handleSubmit}>
            <h2>Crear una Cuenta</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // <-- Uso de setUsername
              placeholder="Nombre de usuario"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // <-- Uso de setEmail
              placeholder="Correo electrónico"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // <-- Uso de setPassword
              placeholder="Contraseña"
              required
            />
            {error && <p className="error-message">{error}</p>} {/* <-- Uso de error */}
            <button type="submit">Registrarse</button>
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