import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  const storedToken = localStorage.getItem('token');
  const storedMsToken = localStorage.getItem('ms_access_token');
  
  const queryParams = new URLSearchParams(location.search);
  const hasAuthParamsInUrl = queryParams.has('app_token') || queryParams.has('ms_access_token');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 font-medium">Authenticating...</p>
      </div>
    );
  }

  const isAuthenticated = Boolean(user || storedToken || storedMsToken || hasAuthParamsInUrl);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (adminOnly && user && user.role !== 'admin') {
    return <Navigate to="/rooms" replace />;
  }

  return children;
};

export default ProtectedRoute;