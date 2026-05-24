import { AbstractModal } from "@/components/AbstractModal/AbstractModal";
import { MoneyDisplay } from "@/components/MoneyDisplay/MoneyDisplay";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload } from "antd";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Check, Copy, UploadCloud } from "lucide-react";
import { useSubscriptionsScreenController } from "./useSubscriptionsScreen.controller";
import Image from "antd/lib/image";

const SubscriptionsScreen = () => {
  const {
    isModalOpen,
    copied,
    data,
    getStatusConfig,
    handleCloseInvoiceModal,
    handleCloseModal,
    handleCopyPixKey,
    pictureFile,
    selectedMonthlyFee,
    setPictureFile,
    setSelectedMonthlyFee,
    handleSendPayment,
    disabledSendProof,
    isSending,
  } = useSubscriptionsScreenController();

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Mensalidades" showBack goBackToOption="/" />
      <AbstractModal
        onOk={handleCloseInvoiceModal}
        onCancel={handleCloseInvoiceModal}
        config={{
          isOpen: isModalOpen,
          title: "Acesso indisponível",
          description:
            "Sua fatura atual está atrasada! Verifique a seção de mensalidades.",
        }}
      />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-3">
        {data?.map((subscription) => {
          const statusConfig = getStatusConfig(subscription.status);
          const StatusIcon = statusConfig.icon;

          return (
            <Card
              key={subscription.id}
              className="p-4 glass-card border-border cursor-pointer tap-highlight-none hover:bg-secondary/30 transition-colors"
              onClick={() => setSelectedMonthlyFee(subscription)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {format(subscription.data_vencimento, "MMMM 'de' yyyy", {
                      locale: ptBR,
                    }).toUpperCase()}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Vencimento:{" "}
                      {format(subscription.data_vencimento, "dd 'de' MMMM", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <MoneyDisplay value={subscription.valor} size="md" />
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgClass} ${statusConfig.textClass}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig.label}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedMonthlyFee} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Mensalidade selecionada</DialogTitle>
            <DialogDescription>Detalhes do pagamento</DialogDescription>
          </DialogHeader>

          {selectedMonthlyFee && (
            <div className="space-y-4 pt-2">
              {/* Valor */}
              <div className="p-4 rounded-lg bg-secondary/50 text-center">
                <p className="text-sm text-muted-foreground mb-1">Valor</p>
                <MoneyDisplay value={selectedMonthlyFee.valor} size="lg" />
              </div>

              {/* Vencimento */}
              <div className="p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Data de Vencimento</span>
                </div>
                <p className="font-semibold text-foreground">
                  {format(
                    selectedMonthlyFee.data_vencimento,
                    "dd 'de' MMMM 'de' yyyy",
                    { locale: ptBR },
                  )}
                </p>
              </div>

              {/* Status */}
              {(() => {
                const statusConfig = getStatusConfig(selectedMonthlyFee.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <div className={`p-4 rounded-lg ${statusConfig.bgClass}`}>
                    <div className="flex items-center gap-2">
                      <StatusIcon
                        className={`w-5 h-5 ${statusConfig.textClass}`}
                      />
                      <span
                        className={`font-semibold ${statusConfig.textClass}`}
                      >
                        Status: {statusConfig.label}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {selectedMonthlyFee.status !== "PAGO" && (
                <div style={{ display: "flex", width: "100%" }}>
                  <Upload
                    listType="picture"
                    fileList={pictureFile}
                    maxCount={1}
                    beforeUpload={() => false}
                    onChange={({ fileList }) => {
                      setPictureFile(fileList.slice(-1));
                    }}
                    disabled={disabledSendProof}
                  >
                    <Button
                      className="w-full h-10 text-base"
                      variant="outline"
                      disabled={disabledSendProof}
                    >
                      <UploadCloud className="w-5 h-5 mr-2" />
                      Anexar comprovante
                    </Button>
                  </Upload>
                </div>
              )}

              {selectedMonthlyFee.comprovante && pictureFile.length === 0 && (
                <Image
                  width={100}
                  alt="basic"
                  src={selectedMonthlyFee.comprovante}
                />
              )}

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Chave PIX para pagamento:
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 rounded-lg bg-secondary/50 border border-border font-mono text-sm text-foreground break-all">
                    {selectedMonthlyFee.link}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopyPixKey(selectedMonthlyFee.link)}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  Fechar
                </Button>

                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleSendPayment}
                  disabled={disabledSendProof || isSending}
                >
                  Enviar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionsScreen;
