import { Loading } from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { Spin } from "antd";
import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export const EmpresaGuard = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
