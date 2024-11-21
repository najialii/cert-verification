import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('cockpitToken'); // Get token from localStorage

  if (!token) {
    // If no token exists, redirect to login page
    return <Navigate to="/loadin" />;
  }

  return children; // If token exists, allow access to the route
};

export default ProtectedRoute;
