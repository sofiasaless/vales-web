import { useEmployees } from '@/context/EmployeeContext';
import { EmployeeCard } from '@/components/EmployeeCard';
import { PageHeader } from '@/components/PageHeader';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { ActiveIncentiveCard } from '@/components/ActiveIncentiveCard';
import { Users, TrendingDown } from 'lucide-react';

const EmployeeListScreen = () => {
  const { state, getVoucherTotal } = useEmployees();
  const { employees } = state;

  // Calculate totals
  const totalVouchers = employees.reduce(
    (sum, emp) => sum + getVoucherTotal(emp.id),
    0
  );

  const employeesWithVoucher = employees.filter(
    (emp) => getVoucherTotal(emp.id) > 0
  ).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Funcionários" subtitle="Gerenciamento de Vales" />

      {/* Summary Cards */}
      <div className="px-4 py-4 max-w-lg mx-auto">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{employees.length}</p>
            <p className="text-xs text-muted-foreground">funcionários</p>
          </div>

          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 text-danger mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-medium">Vales Abertos</span>
            </div>
            <MoneyDisplay value={totalVouchers} size="lg" variant="negative" />
            <p className="text-xs text-muted-foreground mt-1">
              {employeesWithVoucher} funcionário(s)
            </p>
          </div>
        </div>

        {/* Active Incentive Card */}
        <ActiveIncentiveCard />

        {/* Employee Grid */}
        <div className="grid grid-cols-2 gap-3">
          {employees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>

        {employees.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum funcionário cadastrado</p>
            <p className="text-sm text-muted-foreground">
              Toque em "Cadastrar" para adicionar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeListScreen;
