import { Loading } from "@/components/Loading";
import { NotAllowedPage } from "@/components/NotAllowedPage";
import { GerenteResponseBody, TiposGerente } from "@/types/gerente.type";
import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useManagerGuardController } from "./useManagerGuard.controller";

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
  const usuario = JSON.parse(salvo) as GerenteResponseBody;

  if (isLoadingInvoices) return <Loading />;

  if (invoiceModalOpen) {
    if (usuario.tipo === "GERENTE") {
      return (
        <Navigate
          to={"/settings/subscriptions"}
          state={{
            invoiceModalOpen: true,
          }}
        />
      );
    } else {
      return <Navigate to={"/alert/invoice"} />;
    }
  }

  if (!salvo) {
    return <Navigate to="/select-manager" replace />;
  }

  if (permission === "AUXILIAR") {
    return children;
  }
  if (permission === "GERENTE" && usuario.tipo == "GERENTE") {
    return children;
  }
  return <NotAllowedPage />;
};
