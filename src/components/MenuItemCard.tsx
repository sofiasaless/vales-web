import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { ItemMenuResponseBody } from '@/types/menu.type';
import { Minus, Plus } from 'lucide-react';
import { MoneyDisplay } from './MoneyDisplay';

interface MenuItemCardProps {
  product: ItemMenuResponseBody;
  selected: boolean;
  quantity: number;
  onToggle: () => void;
  onQuantityChange: (quantity: number) => void;
  className?: string;
}

export const MenuItemCard = ({
  product,
  selected,
  quantity,
  onToggle,
  onQuantityChange,
  className,
}: MenuItemCardProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl transition-all tap-highlight-none',
        selected
          ? 'bg-primary/10 border border-primary/30'
          : 'bg-card border border-border hover:border-primary/20',
        className
      )}
      style={{cursor: 'pointer'}}
      onClick={onToggle}
    >
      <Checkbox
        checked={selected}
        onCheckedChange={onToggle}
        className="w-5 h-5 border-2"
      />

      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{product.descricao}</p>
      </div>

      <div className="flex items-center gap-3">
        <MoneyDisplay value={product.preco} size="md" />

        {selected && (
          <div className="flex items-center gap-1 bg-secondary rounded-full">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                if (quantity > 1) onQuantityChange(quantity - 1);
              }}
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                onQuantityChange(quantity + 1);
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
