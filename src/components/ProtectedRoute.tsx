import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireManager?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireManager = true 
}) => {
  const { isRestaurantAuthenticated, isManagerAuthenticated } = useAuth();
  const location = useLocation();

  // If restaurant is not authenticated, redirect to login
  if (!isRestaurantAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If manager is required but not authenticated, redirect to select manager
  if (requireManager && !isManagerAuthenticated) {
    return <Navigate to="/select-manager" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
