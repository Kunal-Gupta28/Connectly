import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useUser } from '../contexts/userContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#111827',
        }}
      >
        <CircularProgress sx={{ color: 'rgba(107, 70, 193, 0.8)' }} />
      </Box>
    );
  }

  // If not authenticated, redirect to login with return path
  if (!user) {
    // Save the attempted URL for redirecting after login
    const returnPath = location.pathname + location.search;
    return <Navigate to="/login" state={{ from: { pathname: returnPath } }} />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute; 