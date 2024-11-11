import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ element }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  if (loggedInUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return element;
};

export default PublicRoute;
