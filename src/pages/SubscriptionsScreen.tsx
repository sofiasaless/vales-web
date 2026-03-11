import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoneyDisplay } from "@/components/MoneyDisplay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Calendar,
  Copy,
  Check,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { MensalidadeResponseBody } from "@/types/mensalidade";
import { useListMonthlyFee } from "@/hooks/useMonthlyFee";

const SubscriptionsScreen = () => {
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
    }
  };

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

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Mensalidades" showBack />

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
                    MENSALIDADE -{" "}
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
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>
              Mensalidade selecionada
            </DialogTitle>
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

              {/* Chave PIX */}
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

              <Button
                className="w-full"
                variant="outline"
                onClick={handleCloseModal}
              >
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionsScreen;
