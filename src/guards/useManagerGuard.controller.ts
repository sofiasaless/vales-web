import { useListMonthlyFee } from "@/hooks/useMonthlyFee";
import { MensalidadeResponseBody } from "@/types/mensalidade";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useManagerGuardController() {
  const location = useLocation();

  const { data: invoices, isLoading: isLoadingInvoices } = useListMonthlyFee();
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  const verifyLastInvoicePaymentStatus = (invoice: MensalidadeResponseBody) => {
    if (invoice.status === "VENCIDO") setInvoiceModalOpen(true);
    else setInvoiceModalOpen(false);
  };

  useEffect(() => {
    if (isLoadingInvoices) return;

    verifyLastInvoicePaymentStatus(invoices.reverse().at(0));
  }, [invoices, isLoadingInvoices, location.pathname]);

  return {
    invoiceModalOpen,
    isLoadingInvoices,
  };
}
