import { useNavigate } from 'react-router-dom';
import { Employee } from '@/types';
import { AvatarInitials } from './AvatarInitials';
import { MoneyDisplay } from './MoneyDisplay';
import { StatusBadge } from './StatusBadge';

interface EmployeeCardProps {
  employee: Employee;
}

export const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  const navigate = useNavigate();

  const voucherTotal = employee.currentVoucher.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

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
      className="glass-card card-interactive tap-highlight-none"
      style={{
        width: '100%',
        textAlign: 'center',
        border: '1px solid var(--color-border)',
        background: 'none',
        cursor: 'pointer',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <AvatarInitials name={employee.name} size="md" style={{ marginBottom: 12 }} />
      
      <h3 style={{
        fontWeight: 600,
        color: 'var(--color-text)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '100%',
        fontSize: 14,
        margin: 0,
      }}>
        {employee.name}
      </h3>
      
      <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: '4px 0 8px' }}>
        {employee.role}
      </p>
      
      <div style={{ marginBottom: 8 }}>
        <MoneyDisplay
          value={voucherTotal}
          size="lg"
          variant={voucherTotal > 0 ? 'negative' : 'default'}
        />
      </div>
      
      <StatusBadge status={status} />
    </button>
  );
};
