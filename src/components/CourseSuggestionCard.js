import React, { useState } from 'react'; // Added useState
import { Card, CardContent, Typography, Button, Box, Alert } from '@mui/material'; // Added Alert
import { FaVoteYea } from 'react-icons/fa';
import { api } from '../services/api';

const CourseSuggestionCard = ({ suggestion, onVoteSuccess }) => {
  const [error, setError] = useState(null); // Added error state

  const handleVote = async () => {
    setError(null); // Clear previous errors
    try {
      await api.voteForSuggestion(suggestion.id);
      onVoteSuccess(); // Callback to refresh suggestions in parent component
    } catch (err) {
      console.error('Error voting for suggestion:', err);
      setError(err.message || 'Error al votar por la sugerencia.');
    }
  };

  return (
    <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {suggestion.topic}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Votos: {suggestion.votes}
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Estado: {suggestion.status}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaVoteYea />}
          onClick={handleVote}
          fullWidth
          disabled={suggestion.status === 'course_created'} // Disable voting if course is already created
        >
          Votar
        </Button>
        {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>} {/* Display error message */}
      </Box>
    </Card>
  );
};

export default CourseSuggestionCard;
