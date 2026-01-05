import { VoucherItem } from '@/types';
import { MoneyDisplay } from './MoneyDisplay';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoucherItemCardProps {
  item: VoucherItem;
  onRemove?: () => void;
  onQuantityChange?: (quantity: number) => void;
  showControls?: boolean;
  className?: string;
}

export const VoucherItemCard = ({
  item,
  onRemove,
  onQuantityChange,
  showControls = true,
  className,
}: VoucherItemCardProps) => {
  const totalValue = item.unitPrice * item.quantity;

  return (
    <div
      className={cn(
        'flex items-center justify-between py-3 px-4 bg-secondary/50 rounded-lg',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{item.name}</p>
        <p className="text-sm text-muted-foreground">
          {item.quantity}x <MoneyDisplay value={item.unitPrice} size="sm" />
        </p>
      </div>

      <div className="flex items-center gap-3">
        <MoneyDisplay value={totalValue} size="md" className="font-semibold" />

        {showControls && onRemove && (
          <button
            onClick={onRemove}
            className="p-2 rounded-full bg-danger/10 text-danger hover:bg-danger/20 transition-colors tap-highlight-none"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
