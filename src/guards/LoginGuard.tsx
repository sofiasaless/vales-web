import { Loading } from "@/components/Loading/Loading";
import { useAuth } from "@/context/AuthContext";
import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export const LoginGuard = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading />;

  if (isAuthenticated) {
    return <Navigate to="/select-manager" replace />;
  }

  return children;
};
