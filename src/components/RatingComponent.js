import React, { useState, useEffect, useCallback } from 'react';
import { IconButton, Typography, Box } from '@mui/material';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { api } from '../services/api';
import { useAuth } from '../auth/AuthContext';

const RatingComponent = ({ entityId, entityType, centerAlign = false }) => {
  const { user } = useAuth();
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [userRating, setUserRating] = useState(null); // null: not rated, true: upvote, false: downvote

  const fetchRatings = useCallback(async () => {
    // Removed: if (!user) return; // Only fetch if user is logged in

    try {
      let data;
      if (entityType === 'course') {
        data = await api.getCourseRatingCounts(entityId);
      } else if (entityType === 'module') {
        data = await api.getModuleRatingCounts(entityId);
      }
      setUpvotes(data.upvotes);
      setDownvotes(data.downvotes);
      setUserRating(data.user_rating);
      console.log(`Fetched ratings for ${entityType} ${entityId}: Upvotes=${data.upvotes}, Downvotes=${data.downvotes}, UserRating=${data.user_rating}`);
    } catch (error) {
      console.error(`Error fetching ${entityType} ratings:`, error);
    }
  }, [entityId, entityType, user]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const handleRating = async (isUpvote) => {
    if (!user) {
      alert('Please log in to rate.');
      return;
    }

    try {
      if (entityType === 'course') {
        await api.rateCourse(entityId, isUpvote);
      } else if (entityType === 'module') {
        await api.rateModule(entityId, isUpvote);
      }
      // Re-fetch ratings to update counts and user's rating
      fetchRatings();
    } catch (error) {
      console.error(`Error submitting ${entityType} rating:`, error);
      alert('Error submitting rating.');
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, justifyContent: centerAlign ? 'center' : 'flex-start' }}>
      <IconButton
        onClick={() => handleRating(true)}
        color={userRating === true ? 'success' : 'default'}
        disabled={!user}
      >
        <FaThumbsUp />
      </IconButton>
      <Typography variant="body1">{upvotes}</Typography>

      <IconButton
        onClick={() => handleRating(false)}
        color={userRating === false ? 'error' : 'default'}
        disabled={!user}
      >
        <FaThumbsDown />
      </IconButton>
      <Typography variant="body1">{downvotes}</Typography>
    </Box>
  );
};

export default RatingComponent;