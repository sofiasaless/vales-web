import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  label?: string;
  status: 'pending' | 'paid' | 'today' | 'due';
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'A receber',
    classes: 'bg-warning/15 text-warning border border-warning/30',
  },
  due: {
    label: 'A receber',
    classes: 'bg-danger/15 text-danger border border-danger/30',
  },
  paid: {
    label: 'Pago',
    classes: 'bg-success/15 text-success border border-success/30',
  },
  today: {
    label: 'Pago hoje',
    classes: 'bg-success/20 text-success border border-success/40',
  },
};

export const StatusBadge = ({ status, className, label }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      style={{ fontSize: 10, borderRadius: 6 }}
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium',
        config.classes,
        className
      )}
    >
      {label}
    </span>
  );
};
