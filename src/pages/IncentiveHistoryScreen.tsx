import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MoneyDisplay } from "@/components/MoneyDisplay/MoneyDisplay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useIncentive } from "@/context/IncentiveContext";
import { Trophy, Plus, Calendar, Target, Crown, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const IncentiveHistoryScreen = () => {
  const navigate = useNavigate();
  const { state, addIncentive } = useIncentive();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    descricao: "",
    valor_incentivo: "",
    meta: "",
    data_expiracao: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.descricao ||
      !formData.valor_incentivo ||
      !formData.meta ||
      !formData.data_expiracao
    ) {
      toast.error("Preencha todos os campos");
      return;
    }

    addIncentive({
      descricao: formData.descricao,
      valor_incentivo: parseFloat(formData.valor_incentivo),
      meta: parseInt(formData.meta),
      data_expiracao: new Date(formData.data_expiracao),
    });

    toast.success("Incentivo criado com sucesso!");
    setFormData({
      descricao: "",
      valor_incentivo: "",
      meta: "",
      data_expiracao: "",
    });
    setIsDialogOpen(false);
  };

  const activeIncentive = state.incentivos.find(
    (i) => i.status && !i.ganhador_id,
  );
  const historyIncentives = state.incentivos.filter(
    (i) => !i.status || i.ganhador_id,
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Incentivos" subtitle="Motive sua equipe" showBack />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Active Incentive Banner */}
        {activeIncentive && (
          <Card className="p-4 glass-card border-primary/30 bg-primary/5">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Trophy className="w-5 h-5" />
              <span className="font-semibold">Incentivo Ativo</span>
            </div>
            <p className="text-foreground font-medium">
              {activeIncentive.descricao}
            </p>
            <div className="flex items-center justify-between mt-2">
              <MoneyDisplay
                value={activeIncentive.valor_incentivo}
                size="lg"
                variant="positive"
              />
              <span className="text-sm text-muted-foreground">
                Meta: {activeIncentive.meta} vendas
              </span>
            </div>
          </Card>
        )}

        {/* New Incentive Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full gap-2"
              size="lg"
              disabled={!!activeIncentive}
            >
              <Plus className="w-5 h-5" />
              Começar Novo Incentivo
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Novo Incentivo
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Ex: Vender 30 sobremesas do dia"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor do Prêmio (R$)</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  placeholder="150.00"
                  value={formData.valor_incentivo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      valor_incentivo: e.target.value,
                    })
                  }
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta">Meta (quantidade de vendas)</Label>
                <Input
                  id="meta"
                  type="number"
                  placeholder="20"
                  value={formData.meta}
                  onChange={(e) =>
                    setFormData({ ...formData, meta: e.target.value })
                  }
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiracao">Data de Expiração</Label>
                <Input
                  id="expiracao"
                  type="date"
                  value={formData.data_expiracao}
                  onChange={(e) =>
                    setFormData({ ...formData, data_expiracao: e.target.value })
                  }
                  className="bg-secondary border-border"
                />
              </div>

              <Button type="submit" className="w-full">
                Criar Incentivo
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {activeIncentive && (
          <p className="text-sm text-muted-foreground text-center">
            Finalize o incentivo ativo para criar um novo
          </p>
        )}

        {/* History */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            Histórico de Incentivos
          </h2>

          {historyIncentives.length === 0 ? (
            <Card className="p-8 glass-card border-border text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhum incentivo registrado
              </p>
              <p className="text-sm text-muted-foreground">
                Crie seu primeiro incentivo para motivar a equipe
              </p>
            </Card>
          ) : (
            historyIncentives.map((incentivo) => (
              <Card key={incentivo.id} className="p-4 glass-card border-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {incentivo.descricao}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        Meta: {incentivo.meta}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(
                          new Date(incentivo.data_expiracao),
                          "dd/MM/yy",
                          { locale: ptBR },
                        )}
                      </span>
                    </div>
                  </div>
                  <MoneyDisplay
                    value={incentivo.valor_incentivo}
                    size="md"
                    variant="positive"
                  />
                </div>

                {incentivo.ganhador_nome ? (
                  <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-success/10 border border-success/20">
                    <Crown className="w-4 h-4 text-success" />
                    <span className="text-sm text-success font-medium">
                      Ganhador: {incentivo.ganhador_nome}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-muted">
                    <span className="text-sm text-muted-foreground">
                      Expirado sem ganhador
                    </span>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default IncentiveHistoryScreen;
