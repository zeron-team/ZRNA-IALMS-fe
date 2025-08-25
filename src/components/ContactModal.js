import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, IconButton, Fade } from '@mui/material';
import { FaComments, FaUserLock, FaQuestionCircle, FaPaperPlane, FaTimes } from 'react-icons/fa';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  outline: 'none',
};

const ContactModal = ({ open, onClose }) => {
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

    const phoneNumber = "5491135665266";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    setStep('confirmation');
  };
  
  const handleClose = () => {
    setStep('options');
    onClose();
  }

  const renderFormFields = () => {
    if (reason === 'Cursos') {
      return (
        <>
          <TextField name="firstName" label="Nombre" fullWidth margin="normal" onChange={handleFormChange} required />
          <TextField name="lastName" label="Apellido" fullWidth margin="normal" onChange={handleFormChange} required />
          <TextField name="email" type="email" label="Email" fullWidth margin="normal" onChange={handleFormChange} required />
        </>
      );
    }
    if (reason === 'Usuario') {
      return (
        <>
          <TextField name="email" type="email" label="Email de tu cuenta" fullWidth margin="normal" onChange={handleFormChange} required />
          <TextField name="dni" label="Número de Documento (DNI)" fullWidth margin="normal" onChange={handleFormChange} required />
        </>
      );
    }
    if (reason === 'Otro') {
      return (
        <>
          <TextField name="firstName" label="Nombre" fullWidth margin="normal" onChange={handleFormChange} required />
          <TextField name="lastName" label="Apellido" fullWidth margin="normal" onChange={handleFormChange} required />
          <TextField name="email" type="email" label="Email" fullWidth margin="normal" onChange={handleFormChange} required />
          <TextField name="details" label="Describe tu consulta..." multiline rows={4} fullWidth margin="normal" onChange={handleFormChange} required />
        </>
      );
    }
    return null;
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
    >
      <Fade in={open}>
        <Box sx={style}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <FaTimes />
          </IconButton>

          {step === 'options' && (
            <Box textAlign="center">
              <Typography variant="h5" component="h2" gutterBottom>
                ¿Cómo podemos ayudarte?
              </Typography>
              <Button startIcon={<FaComments />} fullWidth variant="outlined" sx={{ mb: 1 }} onClick={() => handleOptionSelect('Cursos')}>
                Estoy interesado en los cursos
              </Button>
              <Button startIcon={<FaUserLock />} fullWidth variant="outlined" sx={{ mb: 1 }} onClick={() => handleOptionSelect('Usuario')}>
                Tengo problemas con mi usuario y/o clave
              </Button>
              <Button startIcon={<FaQuestionCircle />} fullWidth variant="outlined" onClick={() => handleOptionSelect('Otro')}>
                Quiero contactarme por otra razón
              </Button>
            </Box>
          )}

          {step === 'form' && (
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                Por favor, completa tus datos
              </Typography>
              <form onSubmit={handleSubmit}>
                {renderFormFields()}
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                  Enviar a WhatsApp
                </Button>
              </form>
            </Box>
          )}

          {step === 'confirmation' && (
            <Box textAlign="center">
              <FaPaperPlane size={50} style={{ marginBottom: 16 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                ¡Gracias!
              </Typography>
              <Typography>
                Hemos abierto WhatsApp para que puedas enviar tu mensaje. A la brevedad, un asesor se comunicará contigo.
              </Typography>
            </Box>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default ContactModal;
