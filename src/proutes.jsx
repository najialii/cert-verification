import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated'); // Get authentication status

  if (!isAuthenticated || isAuthenticated !== 'true') {
    // If not authenticated, redirect to login page
    return <Navigate to="/loadin" />;
  }

  return children; // If authenticated, allow access to the route
};

export default ProtectedRoute;
