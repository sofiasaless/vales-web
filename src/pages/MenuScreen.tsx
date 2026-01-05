import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '@/context/EmployeeContext';
import { PageHeader } from '@/components/PageHeader';
import { MenuItemCard } from '@/components/MenuItemCard';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { Button } from '@/components/ui/button';
import { VoucherItem } from '@/types';
import { toast } from 'sonner';
import { ShoppingCart, Package } from 'lucide-react';

interface SelectedItem {
  productId: string;
  quantity: number;
}

const MenuScreen = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const { state, getEmployee, dispatch } = useEmployees();
  const { menuProducts } = state;

  const employee = getEmployee(employeeId || '');
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  if (!employee) {
    navigate('/');
    return null;
  }

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
    const product = menuProducts.find((p) => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  const handleAddToVoucher = () => {
    if (selectedItems.length === 0) return;

    const voucherItems: VoucherItem[] = selectedItems.map((selected) => {
      const product = menuProducts.find((p) => p.id === selected.productId)!;
      return {
        id: `vi-${Date.now()}-${selected.productId}`,
        productId: selected.productId,
        name: product.name,
        unitPrice: product.price,
        quantity: selected.quantity,
        addedAt: new Date(),
      };
    });

    dispatch({
      type: 'ADD_VOUCHER_ITEMS',
      payload: { employeeId: employee.id, items: voucherItems },
    });

    toast.success(`${totalItems} item(ns) adicionado(s) ao vale`);
    navigate(`/employee/${employee.id}`);
  };

  // Group by category
  const categories = [...new Set(menuProducts.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="Cardápio"
        subtitle={`Adicionar ao vale de ${employee.name}`}
        showBack
      />

      <div className="px-4 py-4 max-w-lg mx-auto">
        {categories.map((category) => (
          <div key={category} className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {category}
            </h3>
            <div className="space-y-2">
              {menuProducts
                .filter((p) => p.category === category && p.available)
                .map((product) => (
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
          </div>
        ))}

        {menuProducts.length === 0 && (
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
