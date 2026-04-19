import { Loading } from "@/components/Loading";
import { NotAllowedPage } from "@/components/NotAllowedPage";
import { GerenteResponseBody, TiposGerente } from "@/types/gerente.type";
import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useManagerGuardController } from "./useManagerGuard.controller";
<<<<<<< HEAD
import { Loading } from "@/components/Loading";
import { AlertPage } from "@/components/AlertPage";
=======
>>>>>>> 0e3e9fb (fix: handle para auxiliares em pendências de fatura)

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
<<<<<<< HEAD
=======
  const usuario = JSON.parse(salvo) as GerenteResponseBody;
>>>>>>> 0e3e9fb (fix: handle para auxiliares em pendências de fatura)

  if (isLoadingInvoices) return <Loading />;

  if (invoiceModalOpen) {
<<<<<<< HEAD
    if (permission === "GERENTE") {
      navigate("/settings/subscriptions", {
        state: {
          invoiceModalOpen: true,
        },
      });
    } else {
      return <AlertPage />;
=======
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
>>>>>>> 0e3e9fb (fix: handle para auxiliares em pendências de fatura)
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
