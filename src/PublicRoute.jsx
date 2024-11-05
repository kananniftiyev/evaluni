// PublicRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ element }) => {
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  
  // If the user is logged in, redirect to the dashboard
  if (loggedInUser) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not logged in, render the specified element (login or register)
  return element;
};

export default PublicRoute;
