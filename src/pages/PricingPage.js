import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/'); // Redirect to LandingPage
  }, [navigate]);

  return null; // This component doesn't render anything as it redirects immediately
};

export default PricingPage;