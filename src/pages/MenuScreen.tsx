import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '@/context/EmployeeContext';
import { PageHeader } from '@/components/PageHeader';
import { MenuItemCard } from '@/components/MenuItemCard';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { Button, App } from 'antd';
import { VoucherItem } from '@/types';
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
  const { message } = App.useApp();

  const employee = getEmployee(employeeId || '');
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  if (!employee) {
    navigate('/');
    return null;
  }

  const toggleItem = (productId: string) => {
    setSelectedItems((prev) => {
      const exists = prev.find((item) => item.productId === productId);
      if (exists) return prev.filter((item) => item.productId !== productId);
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setSelectedItems((prev) => prev.map((item) => item.productId === productId ? { ...item, quantity } : item));
  };

  const getSelectedQuantity = (productId: string): number => {
    const item = selectedItems.find((s) => s.productId === productId);
    return item?.quantity || 1;
  };

  const isSelected = (productId: string): boolean => selectedItems.some((s) => s.productId === productId);

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
    dispatch({ type: 'ADD_VOUCHER_ITEMS', payload: { employeeId: employee.id, items: voucherItems } });
    message.success(`${totalItems} item(ns) adicionado(s) ao vale`);
    navigate(`/employee/${employee.id}`);
  };

  const categories = [...new Set(menuProducts.map((p) => p.category))];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 96 }}>
      <PageHeader title="Cardápio" subtitle={`Adicionar ao vale de ${employee.name}`} showBack />

      <div style={{ padding: 16, maxWidth: 512, margin: '0 auto' }}>
        {categories.map((category) => (
          <div key={category} style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
              {category}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Package style={{ width: 48, height: 48, color: 'var(--color-text-secondary)', margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--color-text-secondary)' }}>Nenhum produto no cardápio</p>
          </div>
        )}
      </div>

      {selectedItems.length > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: 16, background: 'linear-gradient(to top, var(--color-bg), var(--color-bg), transparent)' }}>
          <div style={{ maxWidth: 512, margin: '0 auto' }}>
            <Button
              type="primary"
              block
              size="large"
              className="animate-pulse-glow"
              onClick={handleAddToVoucher}
              style={{ height: 56, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <ShoppingCart style={{ width: 20, height: 20 }} />
              Adicionar ao Vale ({totalItems} itens) •{' '}
              <MoneyDisplay value={totalValue} size="md" style={{ color: 'inherit' }} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuScreen;
