import { MenuProduct } from '@/types';
import { MoneyDisplay } from './MoneyDisplay';
import { Button, Checkbox } from 'antd';
import { Minus, Plus } from 'lucide-react';

interface MenuItemCardProps {
  product: MenuProduct;
  selected: boolean;
  quantity: number;
  onToggle: () => void;
  onQuantityChange: (quantity: number) => void;
}

export const MenuItemCard = ({
  product,
  selected,
  quantity,
  onToggle,
  onQuantityChange,
}: MenuItemCardProps) => {
  return (
    <div
      className="tap-highlight-none"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: 16,
        borderRadius: 12,
        transition: 'all 0.2s',
        background: selected ? 'rgba(45, 184, 164, 0.1)' : 'var(--color-bg-card)',
        border: `1px solid ${selected ? 'rgba(45, 184, 164, 0.3)' : 'var(--color-border)'}`,
      }}
    >
      <Checkbox
        checked={selected}
        onChange={onToggle}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 500, color: 'var(--color-text)', margin: 0 }}>{product.name}</p>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>{product.category}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <MoneyDisplay value={product.price} size="md" />

        {selected && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'var(--color-bg-secondary)',
            borderRadius: 20,
          }}>
            <Button
              type="text"
              size="small"
              icon={<Minus style={{ width: 16, height: 16 }} />}
              onClick={(e) => {
                e.stopPropagation();
                if (quantity > 1) onQuantityChange(quantity - 1);
              }}
              disabled={quantity <= 1}
              style={{ borderRadius: '50%', width: 32, height: 32 }}
            />
            <span style={{ width: 32, textAlign: 'center', fontWeight: 600 }}>{quantity}</span>
            <Button
              type="text"
              size="small"
              icon={<Plus style={{ width: 16, height: 16 }} />}
              onClick={(e) => {
                e.stopPropagation();
                onQuantityChange(quantity + 1);
              }}
              style={{ borderRadius: '50%', width: 32, height: 32 }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
