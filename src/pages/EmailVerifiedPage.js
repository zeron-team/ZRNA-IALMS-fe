// frontend/src/pages/EmailVerifiedPage.js

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';

const EmailVerifiedPage = () => {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      api.verifyEmail(token) // Necesitarás añadir api.verifyEmail = (token) => request(`/auth/verify-email?token=${token}`) a tu api.js
        .then(() => setStatus('success'))
        .catch(() => setStatus('error'));
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  return (
    <div className="page-container">
      <div className="page-panel" style={{ textAlign: 'center' }}>
        {status === 'verifying' && <h1>Verificando tu cuenta...</h1>}
        {status === 'success' && <>
          <h1>✅ ¡Cuenta Verificada!</h1>
          <p>Ya puedes iniciar sesión.</p>
          <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
        </>}
        {status === 'error' && <>
          <h1>❌ Error de Verificación</h1>
          <p>El enlace es inválido o ha expirado.</p>
          <Link to="/register" className="btn btn-secondary">Intentar de nuevo</Link>
        </>}
      </div>
    </div>
  );
};

export default EmailVerifiedPage;