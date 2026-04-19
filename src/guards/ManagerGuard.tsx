import { Loading } from "@/components/Loading/Loading";
import { NotAllowedPage } from "@/components/NotAllowedPage/NotAllowedPage";
import { GerenteResponseBody, TiposGerente } from "@/types/gerente.type";
import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useManagerGuardController } from "./useManagerGuard.controller";
import { AlertPage } from "@/components/AlertPage";

export const ManagerGuard = ({
  children,
  permission = "GERENTE",
}: {
  children: JSX.Element;
  permission?: TiposGerente;
}) => {
  const { isLoadingInvoices, invoiceModalOpen } = useManagerGuardController();
  const salvo = localStorage.getItem("usuario");
  const usuario = JSON.parse(salvo) as GerenteResponseBody;

  if (isLoadingInvoices) return <Loading />;

  if (invoiceModalOpen) {
    if (permission === "GERENTE") {
      navigate("/settings/subscriptions", {
        state: {
          invoiceModalOpen: true,
        },
      });
    }
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
