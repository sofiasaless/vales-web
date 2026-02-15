import { MenuItemCard } from '@/components/MenuItemCard';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { useEmployee } from '@/hooks/useEmployee';
import { useListMenu } from '@/hooks/useMenu';
import { Vale } from '@/types/vale.type';
import { Package, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface SelectedItem {
  productId: string;
  quantity: number;
}

const MenuScreen = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const { data: menuProducts } = useListMenu()

  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const toggleItem = (productId: string) => {
    setSelectedItems((prev) => {
      const exists = prev.find((item) => item.productId === productId);
      if (exists) {
        return prev.filter((item) => item.productId !== productId);
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const getSelectedQuantity = (productId: string): number => {
    const item = selectedItems.find((s) => s.productId === productId);
    return item?.quantity || 1;
  };

  const isSelected = (productId: string): boolean => {
    return selectedItems.some((s) => s.productId === productId);
  };

  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  const totalValue = selectedItems.reduce((sum, item) => {
    const product = menuProducts?.find((p) => p.id === item.productId);
    return sum + (product?.preco || 0) * item.quantity;
  }, 0);

  const { addMultipleVouchers } = useEmployee()

  const handleAddToVoucher = async () => {
    if (selectedItems.length === 0) return;

    const voucherItems: Vale[] = selectedItems.map((selected) => {
      const product = menuProducts?.find((p) => p.id === selected.productId)!;
      return {
        id: `${crypto.randomUUID()}`,
        produto_ref: selected.productId,
        descricao: product.descricao,
        preco_unit: product.preco,
        quantidade: selected.quantity
      };
    });

    await addMultipleVouchers.mutateAsync({
      props: {
        employeeId,
        vouchers: voucherItems
      }
    })

  };

  useEffect(() => {
    if (addMultipleVouchers.isPending) return;
    if (addMultipleVouchers.isSuccess) {
      toast.success(`${totalItems} item(ns) adicionado(s) ao vale`);
      navigate(-1)
      return
    }
    if (addMultipleVouchers.isError) {
      toast.error(`Erro ao adicionar vales: ${addMultipleVouchers.error}`);
    }
  }, [addMultipleVouchers.isPending])

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="Cardápio"
        subtitle={`Adicionar ao vale`}
        showBack
      />

      <div className="px-4 py-4 max-w-lg mx-auto">
        <div className="space-y-2">
          {menuProducts?.map((product) => (
            <MenuItemCard
              key={product.id}
              product={product}
              selected={isSelected(product.id)}
              quantity={getSelectedQuantity(product.id)}
              onToggle={() => toggleItem(product.id)}
              onQuantityChange={(qty) => updateQuantity(product.id, qty)}
            />
          ))}
        </div>

        {menuProducts?.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum produto no cardápio</p>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
          <div className="max-w-lg mx-auto">
            <Button
              className="w-full h-14 text-base bg-primary hover:bg-primary/90 shadow-glow animate-pulse-glow"
              onClick={handleAddToVoucher}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Adicionar ao Vale ({totalItems} itens)
              <span className="ml-2 opacity-80">•</span>
              <MoneyDisplay value={totalValue} size="md" className="ml-2 text-primary-foreground" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuScreen;
