import { useListMonthlyFee } from "@/hooks/useMonthlyFee";
import { MensalidadeResponseBody } from "@/types/mensalidade";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useInvoiceModalController() {
  const navigate = useNavigate();
  const { data: invoices, isLoading } = useListMonthlyFee();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleGoToInvoices = () => {
    navigate("/settings/subscriptions");
  };

  const verifyLastInvoicePaymentStatus = (invoice: MensalidadeResponseBody) => {
    if (invoice.status === "VENCIDO") setOpenModal(true);
  };

  useEffect(() => {
    if (isLoading) return;

    verifyLastInvoicePaymentStatus(invoices.reverse().at(0));
  }, [invoices, isLoading]);

  return {
    handleGoToInvoices,
    openModal,
  };
}
