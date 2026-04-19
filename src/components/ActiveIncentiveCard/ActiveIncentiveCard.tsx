import { MoneyDisplay } from "@/components/MoneyDisplay/MoneyDisplay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Crown, ShoppingCart, Target, Trophy } from "lucide-react";
import { useActiveIncentiveCardController } from "./useActiveIncentiveCard.controller";

export const ActiveIncentiveCard = () => {
  const { winner, leader, activeIncentive, navigate } =
    useActiveIncentiveCardController();

  return (
    <Card className="p-4 glass-card border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
      <div className="flex items-center gap-2 text-primary mb-3">
        <Trophy className="w-5 h-5" />
        <span className="font-semibold text-sm">Incentivo Ativo</span>
      </div>

      <p className="text-foreground font-medium mb-2 line-clamp-2">
        {activeIncentive.descricao}
      </p>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {format(new Date(activeIncentive.data_expiracao), "dd/MM", {
            locale: ptBR,
          })}
        </span>
        <span className="flex items-center gap-1">
          <Target className="w-4 h-4" />
          Meta: {activeIncentive.meta}
        </span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <MoneyDisplay
          value={activeIncentive.valor_incentivo}
          size="lg"
          variant="positive"
        />

        {winner ? (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-success/20 border border-success/30">
            <Crown className="w-4 h-4 text-success" />
            <span className="text-sm text-success font-medium">
              {winner.name}
            </span>
          </div>
        ) : leader.count > 0 ? (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Líder</p>
            <p className="text-sm text-foreground font-medium">
              {leader.name} ({leader.count})
            </p>
          </div>
        ) : null}
      </div>

      {!winner && (
        <Button
          className="w-full gap-2"
          onClick={() => navigate("/incentive/sales")}
        >
          <ShoppingCart className="w-4 h-4" />
          Registrar Vendas
        </Button>
      )}
    </Card>
  );
};
