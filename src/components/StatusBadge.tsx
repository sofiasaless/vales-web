import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'pending' | 'paid' | 'today';
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'A receber',
    classes: 'bg-warning/15 text-warning border border-warning/30',
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

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        config.classes,
        className
      )}
    >
      {config.label}
    </span>
  );
};
