import { cn } from '@/lib/utils';
import { Vale } from '@/types/vale.type';
import { Trash2 } from 'lucide-react';
import { MoneyDisplay } from './MoneyDisplay';
import { useEmployee } from '@/hooks/useEmployee';
import { toast } from 'sonner';

interface VoucherItemCardProps {
  item: Vale;
  showControls?: boolean;
  className?: string;
  employeeId: string
}

export const VoucherItemCard = ({
  item,
  showControls = true,
  className,
  employeeId
}: VoucherItemCardProps) => {
  const totalValue = item.preco_unit * item.quantidade;

  const { removeVoucher } = useEmployee()

  const handleRemoveVoucher = async () => {
    await removeVoucher.mutateAsync({props: {
      employeeId,
      voucher: item
    }})

    if (removeVoucher.isSuccess) toast.success('Item removido do vale');
    if (removeVoucher.isError) toast.error(`Erro ao remover item do vale: ${removeVoucher.error}`)
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between py-3 px-4 bg-secondary/50 rounded-lg',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{item.descricao}</p>
        <p className="text-sm text-muted-foreground">
          {item.quantidade}x <MoneyDisplay value={item.preco_unit} size="sm" />
        </p>
      </div>

      <div className="flex items-center gap-3">
        <MoneyDisplay value={totalValue} size="md" className="font-semibold" />

        {showControls && (
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
