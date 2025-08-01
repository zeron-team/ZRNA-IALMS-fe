//frontend/src/components/LessonHeader.js

import React from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar'; // Reutilizamos el progress bar
import '../styles/LessonHeader.css';

const LessonHeader = ({ courseTitle, courseId, courseProgress }) => {
  return (
    <header className="lesson-header">
      <div className="lesson-header-back">
        <Link to={`/course/${courseId}`}>&larr; Volver a la currícula</Link>
      </div>
      <div className="lesson-header-progress">
        <span>Progreso del Curso</span>
        <ProgressBar percentage={courseProgress} />
      </div>
      <div className="lesson-header-title">{courseTitle}</div>
    </header>
  );
};

export default LessonHeader;