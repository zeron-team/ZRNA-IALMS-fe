//frontend/src/components/StarRating.js

import React from 'react';
import { FaStar } from 'react-icons/fa';
import '../styles/StarRating.css';

const StarRating = ({ total, earned }) => {
  const stars = [];
  for (let i = 1; i <= total; i++) {
    stars.push(
      <FaStar key={i} className={i <= earned ? 'star filled' : 'star empty'} />
    );
  }

  return <div className="star-rating">{stars}</div>;
};

export default StarRating;