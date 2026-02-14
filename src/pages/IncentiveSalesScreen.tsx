import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { AvatarInitials } from '@/components/AvatarInitials';
import { Button, App } from 'antd';
import { useIncentive } from '@/context/IncentiveContext';
import { useEmployees } from '@/context/EmployeeContext';
import { Trophy, Minus, Plus, Crown, Target } from 'lucide-react';
import { useEffect } from 'react';

const IncentiveSalesScreen = () => {
  const navigate = useNavigate();
  const { state: incentiveState, getActiveIncentive, getEmployeeCounter, incrementCounter, decrementCounter, setWinner } = useIncentive();
  const { state: employeeState } = useEmployees();
  const { message } = App.useApp();

  const activeIncentive = getActiveIncentive();
  const employees = employeeState.employees;

  useEffect(() => {
    if (!activeIncentive) return;
    for (const employee of employees) {
      const counter = getEmployeeCounter(employee.id);
      if (counter >= activeIncentive.meta && !activeIncentive.ganhador_id) {
        setWinner(employee.id, employee.name);
        message.success(`🎉 ${employee.name} atingiu a meta e ganhou o incentivo!`);
        break;
      }
    }
  }, [incentiveState.employeeCounters, activeIncentive, employees, setWinner, getEmployeeCounter]);

  const handleIncrement = (employeeId: string) => {
    if (activeIncentive?.ganhador_id) { message.error('O incentivo já tem um ganhador'); return; }
    incrementCounter(employeeId);
  };

  const handleDecrement = (employeeId: string) => {
    if (activeIncentive?.ganhador_id) { message.error('O incentivo já tem um ganhador'); return; }
    decrementCounter(employeeId);
  };

  if (!activeIncentive) {
    return (
      <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
        <PageHeader title="Registrar Vendas" subtitle="Incentivo" showBack />
        <div style={{ padding: '32px 16px', maxWidth: 512, margin: '0 auto', textAlign: 'center' }}>
          <Trophy style={{ width: 64, height: 64, color: 'var(--color-text-secondary)', margin: '0 auto 16px' }} />
          <p style={{ fontSize: 18, color: 'var(--color-text-secondary)' }}>Nenhum incentivo ativo</p>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 8 }}>Crie um novo incentivo nas configurações</p>
          <Button type="primary" style={{ marginTop: 16 }} onClick={() => navigate('/settings/incentives')}>Ir para Incentivos</Button>
        </div>
      </div>
    );
  }

  const winner = activeIncentive.ganhador_id ? employees.find(e => e.id === activeIncentive.ganhador_id) : null;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <PageHeader title="Registrar Vendas" subtitle={activeIncentive.descricao} showBack />

      <div style={{ padding: 16, maxWidth: 512, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="glass-card" style={{ border: '1px solid rgba(45,184,164,0.3)', background: 'rgba(45,184,164,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)', marginBottom: 8 }}><Trophy style={{ width: 20, height: 20 }} /><span style={{ fontWeight: 600 }}>Meta do Incentivo</span></div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Target style={{ width: 16, height: 16, color: 'var(--color-text-secondary)' }} /><span>{activeIncentive.meta} vendas para ganhar</span></div>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-success)' }}>R$ {activeIncentive.valor_incentivo.toFixed(2)}</span>
          </div>
        </div>

        {winner && (
          <div className="glass-card" style={{ border: '1px solid rgba(45,184,106,0.3)', background: 'rgba(45,184,106,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ padding: 8, borderRadius: '50%', background: 'rgba(45,184,106,0.2)' }}><Crown style={{ width: 24, height: 24, color: 'var(--color-success)' }} /></div>
              <div><p style={{ color: 'var(--color-success)', fontWeight: 600, margin: 0 }}>Temos um ganhador!</p><p style={{ fontWeight: 500, margin: 0 }}>{winner.name}</p></div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Vendas por Funcionário</h2>
          {employees.map((employee) => {
            const counter = getEmployeeCounter(employee.id);
            const isWinner = activeIncentive.ganhador_id === employee.id;
            const progress = Math.min((counter / activeIncentive.meta) * 100, 100);

            return (
              <div key={employee.id} className="glass-card" style={{ border: isWinner ? '1px solid rgba(45,184,106,0.5)' : undefined, background: isWinner ? 'rgba(45,184,106,0.05)' : undefined }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <AvatarInitials name={employee.name} size="sm" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <p style={{ fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{employee.name}</p>
                      {isWinner && <Crown style={{ width: 16, height: 16, color: 'var(--color-success)', flexShrink: 0 }} />}
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0 }}>{employee.role}</p>
                    <div style={{ marginTop: 8, height: 6, background: 'var(--color-bg-secondary)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${progress}%`, background: isWinner ? 'var(--color-success)' : 'var(--color-primary)', transition: 'width 0.3s', borderRadius: 3 }} />
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>{counter} / {activeIncentive.meta} vendas</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Button size="small" icon={<Minus style={{ width: 16, height: 16 }} />} onClick={() => handleDecrement(employee.id)} disabled={counter === 0 || !!activeIncentive.ganhador_id} style={{ width: 36, height: 36 }} />
                    <span style={{ width: 32, textAlign: 'center', fontWeight: 700, fontSize: 18 }}>{counter}</span>
                    <Button type="primary" size="small" icon={<Plus style={{ width: 16, height: 16 }} />} onClick={() => handleIncrement(employee.id)} disabled={!!activeIncentive.ganhador_id} style={{ width: 36, height: 36 }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IncentiveSalesScreen;
