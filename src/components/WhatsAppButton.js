// frontend/src/components/WhatsAppButton.js

// frontend/src/components/WhatsAppButton.js
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import '../styles/WhatsAppButton.css';

const WhatsAppButton = ({ onClick }) => { // Recibe 'onClick'
  return (
    <button onClick={onClick} className="whatsapp-float">
      <FaWhatsapp className="whatsapp-icon" />
    </button>
  );
};

export default WhatsAppButton;