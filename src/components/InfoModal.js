import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import '../styles/InfoModal.css';

const InfoModal = ({ title, message, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content info-modal-content">
        <div className="info-modal-icon warning">
          <FaExclamationTriangle />
        </div>
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onClose} className="btn btn-primary">
          Entendido
        </button>
      </div>
    </div>
  );
};

export default InfoModal;