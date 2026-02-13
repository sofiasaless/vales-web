import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'antd';
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
    <Card
      style={{
        background: 'linear-gradient(135deg, rgba(45, 184, 164, 0.1), transparent)',
        border: '1px solid rgba(45, 184, 164, 0.3)',
        marginBottom: 16,
      }}
      styles={{ body: { padding: 16 } }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)', marginBottom: 12 }}>
        <Trophy style={{ width: 20, height: 20 }} />
        <span style={{ fontWeight: 600, fontSize: 14 }}>Incentivo Ativo</span>
      </div>

      <p style={{ fontWeight: 500, marginBottom: 8, color: 'var(--color-text)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {activeIncentive.descricao}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Calendar style={{ width: 16, height: 16 }} />
          {format(new Date(activeIncentive.data_expiracao), "dd/MM", { locale: ptBR })}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Target style={{ width: 16, height: 16 }} />
          Meta: {activeIncentive.meta}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <MoneyDisplay value={activeIncentive.valor_incentivo} size="lg" variant="positive" />
        
        {winner ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 8, background: 'rgba(45, 184, 106, 0.2)', border: '1px solid rgba(45, 184, 106, 0.3)' }}>
            <Crown style={{ width: 16, height: 16, color: 'var(--color-success)' }} />
            <span style={{ fontSize: 14, color: 'var(--color-success)', fontWeight: 500 }}>{winner.name}</span>
          </div>
        ) : leader.count > 0 ? (
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0 }}>Líder</p>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)', margin: 0 }}>{leader.name} ({leader.count})</p>
          </div>
        ) : null}
      </div>

      {!winner && (
        <Button
          type="primary"
          block
          icon={<ShoppingCart style={{ width: 16, height: 16 }} />}
          onClick={() => navigate('/incentive/sales')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          Registrar Vendas
        </Button>
      )}
    </Card>
  );
};
