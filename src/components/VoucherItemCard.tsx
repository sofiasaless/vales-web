import { VoucherItem } from '@/types';
import { MoneyDisplay } from './MoneyDisplay';
import { Trash2 } from 'lucide-react';

interface VoucherItemCardProps {
  item: VoucherItem;
  onRemove?: () => void;
  showControls?: boolean;
  bgColor?: string;
}

export const VoucherItemCard = ({
  item,
  onRemove,
  showControls = true,
  bgColor,
}: VoucherItemCardProps) => {
  const totalValue = item.unitPrice * item.quantity;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      background: bgColor || 'rgba(39, 44, 54, 0.5)',
      borderRadius: 8,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 500, color: 'var(--color-text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.name}
        </p>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>
          {item.quantity}x <MoneyDisplay value={item.unitPrice} size="sm" />
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <MoneyDisplay value={totalValue} size="md" style={{ fontWeight: 600 }} />

        {showControls && onRemove && (
          <button
            onClick={onRemove}
            className="tap-highlight-none"
            style={{
              padding: 8,
              borderRadius: '50%',
              background: 'rgba(217, 54, 54, 0.1)',
              color: 'var(--color-danger)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Trash2 style={{ width: 16, height: 16 }} />
          </button>
        )}
      </div>
    </div>
  );
};
