import { NotAllowedPage } from "@/components/NotAllowedPage";
import { GerenteResponseBody, TiposGerente } from "@/types/gerente.type";
import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useManagerGuardController } from "./useManagerGuard.controller";
import { Loading } from "@/components/Loading";
import { AlertPage } from "@/components/AlertPage";

export const ManagerGuard = ({
  children,
  permission = "GERENTE",
}: {
  children: JSX.Element;
  permission?: TiposGerente;
}) => {
  const { isLoadingInvoices, invoiceModalOpen, navigate } =
    useManagerGuardController();
  const salvo = localStorage.getItem("usuario");

  if (isLoadingInvoices) return <Loading />;

  if (invoiceModalOpen) {
    if (permission === "GERENTE") {
      navigate("/settings/subscriptions", {
        state: {
          invoiceModalOpen: true,
        },
      });
    } else {
      return <AlertPage />;
    }
  }

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
