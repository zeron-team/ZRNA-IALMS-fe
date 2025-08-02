// frontend/src/pages/CheckEmailPage.js

import React from 'react';
import { useLocation, Link } from 'react-router-dom'; // <-- Importa useLocation
import { FaPaperPlane } from 'react-icons/fa';
import '../styles/CheckEmailPage.css';

const CheckEmailPage = () => {
  // useLocation nos permite acceder a los datos pasados durante la navegación
  const location = useLocation();
  const email = location.state?.email; // Obtenemos el email

  return (
    <div className="check-email-page">
      <div className="check-email-panel">
        <div className="check-email-icon">
          <FaPaperPlane />
        </div>
        <h1>¡Revisa tu Correo!</h1>

        {/* --- MENSAJE PERSONALIZADO --- */}
        {email ? (
          <p>Hemos enviado un enlace de activación a <strong>{email}</strong>.</p>
        ) : (
          <p>Hemos enviado un enlace de activación a tu correo electrónico.</p>
        )}

        <p className="spam-notice">
          Si no lo encuentras en tu bandeja de entrada, por favor, revisa tu carpeta de spam.
        </p>
        <Link to="/login" className="btn btn-secondary" style={{marginTop: '2rem'}}>Volver a Inicio</Link>
      </div>
    </div>
  );
};

export default CheckEmailPage;