import { Loading } from "@/components/Loading/Loading";
import { NotAllowedPage } from "@/components/NotAllowedPage/NotAllowedPage";
import { GerenteResponseBody, TiposGerente } from "@/types/gerente.type";
import { type JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useManagerGuardController } from "./useManagerGuard.controller";

export const ManagerGuard = ({
  children,
  permission = "GERENTE",
}: {
  children: JSX.Element;
  permission?: TiposGerente;
}) => {
  const { isLoadingInvoices, invoiceModalOpen } = useManagerGuardController();
  const location = useLocation(); // Hook para saber onde estamos

  const salvo = localStorage.getItem("usuario");
  const usuario = salvo ? (JSON.parse(salvo) as GerenteResponseBody) : null;

  if (isLoadingInvoices) return <Loading />;

  if (invoiceModalOpen && location.pathname !== "/settings/subscriptions") {
    if (usuario?.tipo === "GERENTE") {
      console.info("redirecionando pra mensalidades");
      return (
        <Navigate
          to={"/settings/subscriptions"}
          state={{ invoiceModalOpen: true }}
          replace
        />
      );
    } else {
      if (location.pathname !== "/alert/invoice") {
        return <Navigate to={"/alert/invoice"} replace />;
      }
    }
  }

  if (!salvo) return <Navigate to="/select-manager" replace />;

  if (permission === "AUXILIAR") return children;

  if (permission === "GERENTE" && usuario?.tipo === "GERENTE") {
    return children;
  }

  return <NotAllowedPage />;
};
