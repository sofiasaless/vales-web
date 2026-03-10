import { useAuth } from "@/context/AuthContext";
import { Spin } from "antd";
import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export const EmpresaGuard = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          height: "100vh",
          justifyItems: 'center',
        }}
      >
        <Spin />
      </div>
    );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
