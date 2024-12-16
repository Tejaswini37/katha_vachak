import React from "react";
import { Navigate } from "react-router-dom";

// Assuming `auth` is some state or logic that checks if the user is authenticated
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("token"); // Check if token exists in localStorage

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  return element; // Return the protected element (e.g., ReadBooks or Home)
};

export default ProtectedRoute;
