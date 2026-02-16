import { MenuItemCard } from '@/components/MenuItemCard';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { PageHeader } from '@/components/PageHeader';
import { useEmployee } from '@/hooks/useEmployee';
import { useListMenu } from '@/hooks/useMenu';
import { Vale } from '@/types/vale.type';
import { Button, Input, Spin } from 'antd';
import { Package, Search, ShoppingCart } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface SelectedItem {
  productId: string;
  quantity: number;
}

const MenuScreen = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const { data: menuProducts, isLoading: isLoadingMenu, isPending } = useListMenu()

  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!menuProducts) return [];
    if (!searchQuery.trim()) return menuProducts;
    return menuProducts.filter((p) =>
      p.descricao.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [menuProducts, searchQuery]);

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
    <div style={{ minHeight: '100vh', paddingBottom: 96 }}>
      <PageHeader
        title="Cardápio"
        subtitle={`Adicionar ao vale`}
        showBack
      />

      <div style={{ position: 'sticky', top: 57, zIndex: 20, background: 'var(--bg-primary)', padding: '16px 16px', maxWidth: 512, margin: '0 auto' }}>
        <Input
          style={{ marginBlock: '8px' }}
          prefix={<Search style={{ width: 16, height: 16, color: 'var(--text-secondary)' }} />}
          placeholder="Buscar produto..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
          size="large"
        />
      </div>
      <div style={{ padding: '0 16px 16px', maxWidth: 512, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {
            (isLoadingMenu || isPending) ?
              <Spin />
              :
              filteredProducts.map((product) => (
                <MenuItemCard
                  key={product.id}
                  product={product}
                  selected={isSelected(product.id)}
                  quantity={getSelectedQuantity(product.id)}
                  onToggle={() => toggleItem(product.id)}
                  onQuantityChange={(qty) => updateQuantity(product.id, qty)}
                />
              ))
          }
        </div>

        {filteredProducts.length === 0 && !isLoadingMenu && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Package style={{ width: 48, height: 48, color: 'var(--text-secondary)', margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-secondary)' }}>
              {searchQuery ? 'Nenhum produto encontrado' : 'Nenhum produto no cardápio'}
            </p>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      {selectedItems.length > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: 16, background: 'linear-gradient(to top, var(--bg-primary), var(--bg-primary), transparent)' }}>
          <div style={{ maxWidth: 512, margin: '0 auto' }}>
            <Button
              type="primary"
              block
              size="large"
              icon={<ShoppingCart style={{ width: 20, height: 20 }} />}
              onClick={handleAddToVoucher}
              style={{ height: 56 }}
            >
              Adicionar ao Vale ({totalItems} itens) • <MoneyDisplay value={totalValue} size="md" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuScreen;
