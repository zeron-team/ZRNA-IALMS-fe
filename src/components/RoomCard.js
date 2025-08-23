// frontend/src/components/RoomCard.js

import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const RoomCard = ({ room }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {room.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {room.description}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button 
          component={Link} 
          to={`/rooms/${room.id}`} 
          variant="contained" 
          endIcon={<FaArrowRight />}
          fullWidth
        >
          Ver Sala
        </Button>
      </Box>
    </Card>
  );
};

export default RoomCard;
