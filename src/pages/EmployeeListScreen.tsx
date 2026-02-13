import { useEmployees } from '@/context/EmployeeContext';
import { EmployeeCard } from '@/components/EmployeeCard';
import { PageHeader } from '@/components/PageHeader';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { ActiveIncentiveCard } from '@/components/ActiveIncentiveCard';
import { Users, TrendingDown } from 'lucide-react';

const EmployeeListScreen = () => {
  const { state, getVoucherTotal } = useEmployees();
  const { employees } = state;

  const totalVouchers = employees.reduce((sum, emp) => sum + getVoucherTotal(emp.id), 0);
  const employeesWithVoucher = employees.filter((emp) => getVoucherTotal(emp.id) > 0).length;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <PageHeader title="Funcionários" subtitle="Gerenciamento de Vales" />

      <div style={{ padding: 16, maxWidth: 512, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
              <Users style={{ width: 16, height: 16 }} />
              <span style={{ fontSize: 12, fontWeight: 500 }}>Total</span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{employees.length}</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0 }}>funcionários</p>
          </div>

          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-danger)', marginBottom: 4 }}>
              <TrendingDown style={{ width: 16, height: 16 }} />
              <span style={{ fontSize: 12, fontWeight: 500 }}>Vales Abertos</span>
            </div>
            <MoneyDisplay value={totalVouchers} size="lg" variant="negative" />
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>
              {employeesWithVoucher} funcionário(s)
            </p>
          </div>
        </div>

        <ActiveIncentiveCard />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {employees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>

        {employees.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Users style={{ width: 48, height: 48, color: 'var(--color-text-secondary)', margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--color-text-secondary)' }}>Nenhum funcionário cadastrado</p>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Toque em "Cadastrar" para adicionar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeListScreen;
