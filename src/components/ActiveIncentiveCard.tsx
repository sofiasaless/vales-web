import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { useIncentive } from '@/context/IncentiveContext';
import { useEmployees } from '@/context/EmployeeContext';
import { Trophy, Calendar, Target, Crown, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ActiveIncentiveCard = () => {
  const navigate = useNavigate();
  const { getActiveIncentive, getEmployeeCounter } = useIncentive();
  const { state: employeeState } = useEmployees();

  const activeIncentive = getActiveIncentive();

  if (!activeIncentive) return null;

  const winner = activeIncentive.ganhador_id 
    ? employeeState.employees.find(e => e.id === activeIncentive.ganhador_id)
    : null;

  // Find current leader
  let leader = { name: '', count: 0 };
  if (!winner) {
    for (const employee of employeeState.employees) {
      const count = getEmployeeCounter(employee.id);
      if (count > leader.count) {
        leader = { name: employee.name, count };
      }
    }
  }

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
          {format(new Date(activeIncentive.data_expiracao), "dd/MM", { locale: ptBR })}
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
          onClick={() => navigate('/incentive/sales')}
        >
          <ShoppingCart className="w-4 h-4" />
          Registrar Vendas
        </Button>
      )}
    </Card>
  );
};
