// frontend/src/components/EnrollmentModal.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import '../styles/EnrollmentModal.css';

const EnrollmentModal = ({ courseId, onClose }) => {
  const navigate = useNavigate();

  const handleGoToCourse = () => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content enrollment-modal-content">
        <div className="enrollment-modal-icon">
          <FaLock />
        </div>
        <h2>Contenido Bloqueado</h2>
        <p>Para acceder a esta lección, primero debes inscribirte en el curso.</p>
        <div className="enrollment-modal-actions">
          <button onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button onClick={handleGoToCourse} className="btn btn-primary">
            Ir al Curso para Inscribirme
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentModal;