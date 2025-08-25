import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import StarRating from './StarRating';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Radio, RadioGroup, FormControlLabel, FormControl, LinearProgress } from '@mui/material';

const Quiz = ({ quizData, moduleId, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers({});
    setResult(null);
  }, [quizData]);

  const currentQuestion = quizData.questions[currentQuestionIndex];

  const handleOptionChange = (event) => {
    setSelectedOption(Number(event.target.value));
  };

  const handleNextQuestion = () => {
    const newAnswers = { ...answers, [currentQuestion.id]: selectedOption };
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers) => {
    setIsSubmitting(true);
    try {
      const quizResult = await api.submitQuiz(moduleId, { answers: finalAnswers });
      setResult(quizResult);
      onQuizComplete(quizResult.passed);
    } catch (error) {
      alert(`Error al enviar el quiz: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ color: result.passed ? 'success.main' : 'error.main', mb: 2 }}>
          {result.passed ? <FaCheckCircle size={50} /> : <FaTimesCircle size={50} />}
        </Box>
        <Typography variant="h4" component="h2" sx={{ color: result.passed ? 'success.main' : 'error.main' }}>
          {result.passed ? '¡Módulo Superado!' : 'Debes Repasar'}
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>Tu calificación: <strong>{result.score}%</strong></Typography>
        <Typography variant="body1" sx={{ mt: 1, fontStyle: 'italic' }}>"{result.motivational_phrase}"</Typography>
        <Box sx={{ my: 3 }}>
          <Typography>Progreso General del Curso:</Typography>
          <StarRating total={result.course_total_stars} earned={result.course_earned_stars} />
        </Box>
        <Button variant="contained" onClick={() => navigate(`/course/${quizData.course_id}`)}>
          Volver a la Currícula
        </Button>
      </Paper>
    );
  }

  const progress = (currentQuestionIndex + 1) / quizData.questions.length * 100;

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" component="h3">Prueba de Conocimientos</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
          <Box sx={{ minWidth: 35 }}>
            <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>{currentQuestion.question_text}</Typography>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="quiz"
            name="quiz"
            value={selectedOption}
            onChange={handleOptionChange}
          >
            {currentQuestion.options.map(opt => (
              <FormControlLabel key={opt.id} value={opt.id} control={<Radio />} label={opt.option_text} />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Button
          variant="contained"
          onClick={handleNextQuestion}
          disabled={!selectedOption || isSubmitting}
        >
          {isSubmitting ? 'Calificando...' : (currentQuestionIndex < quizData.questions.length - 1 ? 'Siguiente' : 'Calificar Quiz')}
        </Button>
      </Box>
    </Paper>
  );
};

export default Quiz;