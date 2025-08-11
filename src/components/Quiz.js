// frontend/src/components/Quiz.js

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/Quiz.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import StarRating from './StarRating';
import { useNavigate } from 'react-router-dom';

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

  const handleOptionChange = (optionId) => {
    setSelectedOption(optionId);
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
      <div className="quiz-result-panel">
        <div className={`icon ${result.passed ? 'passed' : 'failed'}`}>
          {result.passed ? <FaCheckCircle /> : <FaTimesCircle />}
        </div>
        <h2 className={result.passed ? 'passed' : 'failed'}>
          {result.passed ? '¡Módulo Superado!' : 'Debes Repasar'}
        </h2>
        <p className="score">Tu calificación: <strong>{result.score}%</strong></p>
        <p className="feedback-text">"{result.motivational_phrase}"</p>
        <div className="course-progress-summary">
          <p>Progreso General del Curso:</p>
          <StarRating total={result.course_total_stars} earned={result.course_earned_stars} />
        </div>
        <div className="result-actions">
          <button className="btn btn-secondary" onClick={() => navigate(`/course/${quizData.course_id}`)}>
            Volver a la Currícula
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h3 className="quiz-title">Prueba de Conocimientos</h3>
        <div className="quiz-progress">
          Pregunta {currentQuestionIndex + 1} de {quizData.questions.length}
        </div>
      </div>
      <div className="question-block">
        <p className="question-text">{currentQuestion.question_text}</p>
        <div className="options-block">
          {currentQuestion.options.map(opt => (
            <label key={opt.id} className={`option-label ${selectedOption === opt.id ? 'selected' : ''}`}>
              <input
                type="radio" name={String(currentQuestion.id)} value={opt.id}
                onChange={() => handleOptionChange(opt.id)} checked={selectedOption === opt.id}
              />
              {opt.option_text}
            </label>
          ))}
        </div>
      </div>
      <div className="quiz-footer">
        <button
          onClick={handleNextQuestion}
          disabled={!selectedOption || isSubmitting}
          className="btn btn-primary">
          {isSubmitting ? 'Calificando...' : (currentQuestionIndex < quizData.questions.length - 1 ? 'Siguiente' : 'Calificar Quiz')}
        </button>
      </div>
    </div>
  );
};

export default Quiz;