// frontend/src/components/ProgressBar.js

import React from 'react';
import { Box, LinearProgress, Typography, Tooltip } from '@mui/material';

const ProgressBar = ({ percentage }) => {
  const validPercentage = Math.max(0, Math.min(100, percentage || 0));

  const progressColor = () => {
    if (validPercentage === 100) return 'success';
    if (validPercentage > 50) return 'primary';
    return 'warning';
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <Tooltip title={`${Math.round(validPercentage)}% Completado`} arrow>
          <LinearProgress 
            variant="determinate" 
            value={validPercentage} 
            color={progressColor()}
            sx={{
              height: 8, // Smaller height
              borderRadius: 5,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
              },
            }}
          />
        </Tooltip>
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(validPercentage)}%`}</Typography>
      </Box>
    </Box>
  );
};

export default ProgressBar;