import { useAuth } from '@/context/AuthContext';
import { useCurrentManager } from '@/hooks/useManager';
import { Spin } from 'antd';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireManager?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireManager = true 
}) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const { data: isManagerAuthenticated, isLoading: isLoadingManager } = useCurrentManager()

  // If restaurant is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoadingManager) return <Spin />

  // If manager is required but not authenticated, redirect to select manager
  if (requireManager && !isManagerAuthenticated) {
    return <Navigate to="/select-manager" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
