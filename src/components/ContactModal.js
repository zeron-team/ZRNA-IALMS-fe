import React, { useState } from 'react';
import { FaComments, FaUserLock, FaQuestionCircle, FaPaperPlane } from 'react-icons/fa';
import '../styles/ContactModal.css';

const ContactModal = ({ onClose }) => {
  const [step, setStep] = useState('options'); // options, form, confirmation
  const [reason, setReason] = useState('');
  const [formData, setFormData] = useState({});

  const handleOptionSelect = (selectedReason) => {
    setReason(selectedReason);
    setStep('form');
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let message = `Hola, te contacto por el siguiente motivo: ${reason}\n\n`;

    if (reason === 'Cursos') {
      message += `Nombre: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}`;
    } else if (reason === 'Usuario') {
      message += `Email: ${formData.email}\nDNI: ${formData.dni}`;
    } else {
      message += `Nombre: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\nMotivo: ${formData.details}`;
    }

    const phoneNumber = "5491164640871";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    setStep('confirmation');
  };

  const renderFormFields = () => {
    if (reason === 'Cursos') {
      return (
        <>
          <input name="firstName" placeholder="Nombre" onChange={handleFormChange} required />
          <input name="lastName" placeholder="Apellido" onChange={handleFormChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleFormChange} required />
        </>
      );
    }
    if (reason === 'Usuario') {
      return (
        <>
          <input name="email" type="email" placeholder="Email de tu cuenta" onChange={handleFormChange} required />
          <input name="dni" placeholder="Número de Documento (DNI)" onChange={handleFormChange} required />
        </>
      );
    }
    if (reason === 'Otro') {
      return (
        <>
          <input name="firstName" placeholder="Nombre" onChange={handleFormChange} required />
          <input name="lastName" placeholder="Apellido" onChange={handleFormChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleFormChange} required />
          <textarea name="details" placeholder="Describe tu consulta..." onChange={handleFormChange} required />
        </>
      );
    }
    return null;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content contact-modal" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="close-button">&times;</button>

        {step === 'options' && (
          <div className="contact-step">
            <h2>¿Cómo podemos ayudarte?</h2>
            <button onClick={() => handleOptionSelect('Cursos')} className="contact-option">
              <FaComments /> Estoy interesado en los cursos
            </button>
            <button onClick={() => handleOptionSelect('Usuario')} className="contact-option">
              <FaUserLock /> Tengo problemas con mi usuario y/o clave
            </button>
            <button onClick={() => handleOptionSelect('Otro')} className="contact-option">
              <FaQuestionCircle /> Quiero contactarme por otra razón
            </button>
          </div>
        )}

        {step === 'form' && (
          <div className="contact-step">
            <h2>Por favor, completa tus datos</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              {renderFormFields()}
              <button type="submit" className="btn btn-primary">Enviar a WhatsApp</button>
            </form>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="contact-step confirmation">
            <FaPaperPlane className="confirmation-icon" />
            <h3>¡Gracias!</h3>
            <p>Hemos abierto WhatsApp para que puedas enviar tu mensaje. A la brevedad, un asesor se comunicará contigo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactModal;