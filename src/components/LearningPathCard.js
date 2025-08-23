// frontend/src/components/LearningPathCard.js

import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const LearningPathCard = ({ path }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {path.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {path.description}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button 
          component={Link} 
          to={`/learning-paths/${path.id}`} 
          variant="contained" 
          endIcon={<FaArrowRight />}
          fullWidth
        >
          Ver Ruta
        </Button>
      </Box>
    </Card>
  );
};

export default LearningPathCard;
