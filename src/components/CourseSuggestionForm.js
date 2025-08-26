import React, { useState, useEffect } from 'react'; // Added useEffect
import { TextField, Button, Box, Typography, Alert, Autocomplete, CircularProgress } from '@mui/material'; // Added Autocomplete, CircularProgress
import { FaPaperPlane } from 'react-icons/fa';
import { api } from '../services/api';

const CourseSuggestionForm = ({ onNewSuggestion }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Autocomplete states
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);

  useEffect(() => {
    let active = true;

    if (topic === '') {
      setOptions([]);
      return undefined;
    }

    setAutocompleteLoading(true);
    const fetchSuggestions = async () => {
      try {
        const response = await api.searchCourseSuggestions(topic);
        if (active) {
          setOptions(response);
        }
      } catch (err) {
        console.error('Error fetching autocomplete suggestions:', err);
      } finally {
        if (active) {
          setAutocompleteLoading(false);
        }
      }
    };

    const debounceTimeout = setTimeout(fetchSuggestions, 300); // Debounce API calls

    return () => {
      active = false;
      clearTimeout(debounceTimeout);
    };
  }, [topic]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.createCourseSuggestion({ topic });
      setSuccess(true);
      setTopic(''); // Clear the input
      if (onNewSuggestion) {
        onNewSuggestion(); // Callback to refresh suggestions in parent component
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al enviar la sugerencia.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{
        mt: 4,
        p: 3,
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h6" component="h4" gutterBottom>
        ¿Qué curso te gustaría ver?
      </Typography>
      <Autocomplete
        id="course-suggestion-autocomplete"
        sx={{ mb: 2 }}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.topic}
        options={options}
        loading={autocompleteLoading}
        noOptionsText={autocompleteLoading ? "Cargando..." : "No hay sugerencias"}
        onChange={(event, newValue) => {
          setTopic(newValue ? newValue.topic : '');
        }}
        onInputChange={(event, newInputValue) => {
          setTopic(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Propón un tema para un nuevo curso"
            variant="outlined"
            required
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {autocompleteLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        endIcon={<FaPaperPlane />}
        disabled={loading}
      >
        {loading ? 'Enviando...' : 'Enviar Sugerencia'}
      </Button>
      {success && <Alert severity="success" sx={{ mt: 2 }}>¡Sugerencia enviada con éxito!</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default CourseSuggestionForm;
