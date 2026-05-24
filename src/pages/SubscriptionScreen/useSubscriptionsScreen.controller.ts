import { useInvoiceActions, useListMonthlyFee } from "@/hooks/useMonthlyFee";
import { MensalidadeResponseBody } from "@/types/mensalidade";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { UploadFile } from "antd/lib/upload";
import { CloudinaryService } from "@/services/clodinary.service";

export interface SubscriptionsScreenStateProps {
  invoiceModalOpen: boolean;
}

export function useSubscriptionsScreenController() {
  const [selectedMonthlyFee, setSelectedMonthlyFee] =
    useState<MensalidadeResponseBody | null>(null);
  const [copied, setCopied] = useState(false);

  const { data } = useListMonthlyFee();

  const getStatusConfig = (status: MensalidadeResponseBody["status"]) => {
    switch (status) {
      case "PAGO":
        return {
          label: "Pago",
          bgClass: "bg-success/10",
          textClass: "text-success",
          icon: CheckCircle2,
        };
      case "PENDENTE":
        return {
          label: "Pendente",
          bgClass: "bg-warning/10",
          textClass: "text-warning",
          icon: Clock,
        };
      case "VENCIDO":
        return {
          label: "Vencido",
          bgClass: "bg-danger/10",
          textClass: "text-danger",
          icon: AlertCircle,
        };
      case "ANÁLISE":
        return {
          label: "Em análise",
          bgClass: "bg-blue-500/10",
          textClass: "text-blue-500",
          icon: AlertCircle,
        };
    }
  };

  const [pictureFile, setPictureFile] = useState<UploadFile[]>([]);

  const handleCopyPixKey = async (pixKey: string) => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      toast.success("Chave PIX copiada!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Erro ao copiar chave PIX");
    }
  };

  const handleCloseModal = () => {
    setSelectedMonthlyFee(null);
    setCopied(false);
  };

  const location = useLocation();
  const state = location.state as SubscriptionsScreenStateProps;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(
    !!state?.invoiceModalOpen,
  );

  const handleCloseInvoiceModal = () => setIsModalOpen(false);

  const { sendPayment } = useInvoiceActions();

  const [isSending, setIsSending] = useState(false);
  const handleSendPayment = async () => {
    try {
      setIsSending(true);
      if (pictureFile.length > 0 && pictureFile[0].originFileObj) {
        const uploadedPicture = (await CloudinaryService.sendPicture(
          pictureFile[0].originFileObj as File,
        )) as string;

        await sendPayment.mutateAsync({
          invoiceId: selectedMonthlyFee.id,
          proofPicture: uploadedPicture,
        });

        toast.success("Comprovante enviado para análise!");
        setPictureFile([]);
        handleCloseInvoiceModal();
        handleCloseModal();
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao enviar o comprovante de pagamento");
    } finally {
      setIsSending(false);
    }
  };

  const disabledSendProof =
    (pictureFile.length === 0 || !!selectedMonthlyFee?.comprovante != null) &&
    selectedMonthlyFee?.status !== "PENDENTE";

  return {
    handleCloseInvoiceModal,
    data,
    getStatusConfig,
    setSelectedMonthlyFee,
    selectedMonthlyFee,
    handleCloseModal,
    pictureFile,
    setPictureFile,
    handleCopyPixKey,
    copied,
    isModalOpen,
    handleSendPayment,
    disabledSendProof,
    isSending,
  };
}
