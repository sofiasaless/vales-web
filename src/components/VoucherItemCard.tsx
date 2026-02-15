import { cn } from '@/lib/utils';
import { Vale } from '@/types/vale.type';
import { VoucherItem } from '@/types';
import { Trash2 } from 'lucide-react';
import { MoneyDisplay } from './MoneyDisplay';
import { useEmployee } from '@/hooks/useEmployee';
import { message } from 'antd';

type VoucherItemType = Vale | VoucherItem;

function isVale(item: VoucherItemType): item is Vale {
  return 'preco_unit' in item;
}

function getItemFields(item: VoucherItemType) {
  if (isVale(item)) {
    return { name: item.descricao, unitPrice: item.preco_unit, quantity: item.quantidade };
  }
  return { name: item.name, unitPrice: item.unitPrice, quantity: item.quantity };
}

interface VoucherItemCardProps {
  item: VoucherItemType;
  showControls?: boolean;
  className?: string;
  employeeId?: string;
}

export const VoucherItemCard = ({
  item,
  showControls = true,
  className,
  employeeId
}: VoucherItemCardProps) => {
  const { name, unitPrice, quantity } = getItemFields(item);
  const totalValue = unitPrice * quantity;

  const { removeVoucher } = useEmployee();

  const handleRemoveVoucher = async () => {
    if (!employeeId || !isVale(item)) return;
    await removeVoucher.mutateAsync({ props: { employeeId, voucher: item } });

    if (removeVoucher.isSuccess) message.success('Item removido do vale');
    if (removeVoucher.isError) message.error(`Erro ao remover item do vale: ${removeVoucher.error}`);
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between py-3 px-4 bg-secondary/50 rounded-lg',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{name}</p>
        <p className="text-sm text-muted-foreground">
          {quantity}x <MoneyDisplay value={unitPrice} size="sm" />
        </p>
      </div>

      <div className="flex items-center gap-3">
        <MoneyDisplay value={totalValue} size="md" className="font-semibold" />

        {showControls && employeeId && (
          <button
            onClick={handleRemoveVoucher}
            className="p-2 rounded-full bg-danger/10 text-danger hover:bg-danger/20 transition-colors tap-highlight-none"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
