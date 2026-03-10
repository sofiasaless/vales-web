import { type JSX } from "react";
import { Navigate } from "react-router-dom";

export const ManagerGuard = ({ children }: { children: JSX.Element }) => {

  const salvo = localStorage.getItem("usuario");
  if (!salvo) {
    return <Navigate to="/select-manager" replace />;
  } else {
    return children
  }
};