interface StatusBadgeProps {
  status: 'pending' | 'paid' | 'today';
}

const statusConfig = {
  pending: { label: 'A receber', bg: 'rgba(242, 166, 13, 0.15)', color: '#f2a60d', border: 'rgba(242, 166, 13, 0.3)' },
  paid: { label: 'Pago', bg: 'rgba(45, 184, 106, 0.15)', color: '#2db86a', border: 'rgba(45, 184, 106, 0.3)' },
  today: { label: 'Pago hoje', bg: 'rgba(45, 184, 106, 0.2)', color: '#2db86a', border: 'rgba(45, 184, 106, 0.4)' },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 500,
      background: config.bg,
      color: config.color,
      border: `1px solid ${config.border}`,
    }}>
      {config.label}
    </span>
  );
};
