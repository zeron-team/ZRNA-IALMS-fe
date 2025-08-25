import React from 'react';
import ReactMarkdown from 'react-markdown';
import ThinkingIndicator from './ThinkingIndicator';
import { Modal, Box, Typography, Button } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  outline: 'none',
};

const SummaryModal = ({ open, onClose, title, content, isLoading }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <hr />
        {isLoading ? (
          <ThinkingIndicator />
        ) : (
          <ReactMarkdown children={content} />
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={onClose} variant="contained">Cerrar</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SummaryModal;