import { NotAllowedPage } from "@/components/NotAllowedPage";
import { GerenteResponseBody, TiposGerente } from "@/types/gerente.type";
import { type JSX } from "react";
import { Navigate } from "react-router-dom";

export const ManagerGuard = ({
  children,
  permission = "GERENTE",
}: {
  children: JSX.Element;
  permission?: TiposGerente;
}) => {
  const salvo = localStorage.getItem("usuario");
  if (!salvo) {
    return <Navigate to="/select-manager" replace />;
  }
  
  const usuario = JSON.parse(salvo) as GerenteResponseBody;
  if (permission === "AUXILIAR") {
    return children;
  }
  if (permission === "GERENTE" && usuario.tipo == "GERENTE") {
    return children;
  }
  return <NotAllowedPage />;
};
