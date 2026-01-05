import { useNavigate } from 'react-router-dom';
import { Employee } from '@/types';
import { AvatarInitials } from './AvatarInitials';
import { MoneyDisplay } from './MoneyDisplay';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';

interface EmployeeCardProps {
  employee: Employee;
  className?: string;
}

export const EmployeeCard = ({ employee, className }: EmployeeCardProps) => {
  const navigate = useNavigate();

  const voucherTotal = employee.currentVoucher.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

  // Check if paid today
  const today = new Date();
  const paidToday = employee.paymentHistory.some((payment) => {
    const paymentDate = new Date(payment.date);
    return (
      paymentDate.getDate() === today.getDate() &&
      paymentDate.getMonth() === today.getMonth() &&
      paymentDate.getFullYear() === today.getFullYear()
    );
  });

  const status = paidToday ? 'today' : voucherTotal > 0 ? 'pending' : 'paid';

  return (
    <button
      onClick={() => navigate(`/employee/${employee.id}`)}
      className={cn(
        'glass-card rounded-xl p-4 text-left w-full card-interactive tap-highlight-none',
        'hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50',
        className
      )}
    >
      <div className="flex flex-col items-center text-center">
        <AvatarInitials name={employee.name} size="md" className="mb-3" />
        
        <h3 className="font-semibold text-foreground truncate w-full">
          {employee.name}
        </h3>
        
        <p className="text-xs text-muted-foreground mb-2">{employee.role}</p>
        
        <div className="mb-2">
          <MoneyDisplay
            value={voucherTotal}
            size="lg"
            variant={voucherTotal > 0 ? 'negative' : 'default'}
          />
        </div>
        
        <StatusBadge status={status} />
      </div>
    </button>
  );
};
