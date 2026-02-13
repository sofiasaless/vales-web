import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { Button, Input, Modal, App } from 'antd';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/format';
import { Plus, ShoppingCart, Wine, Beef, TrendingUp, Truck, Utensils, Package, ChevronRight } from 'lucide-react';

export interface ExpenseCategory {
  id: string; name: string; icon: string; color: string; totalMonth: number;
}

const initialCategories: ExpenseCategory[] = [
  { id: '1', name: 'Mercado', icon: 'shopping-cart', color: '#3b82f6', totalMonth: 2450.00 },
  { id: '2', name: 'Bebidas', icon: 'wine', color: '#8b5cf6', totalMonth: 890.50 },
  { id: '3', name: 'Carnes', icon: 'beef', color: '#ef4444', totalMonth: 1560.00 },
  { id: '4', name: 'Investimentos', icon: 'trending-up', color: '#22c55e', totalMonth: 3000.00 },
  { id: '5', name: 'Fornecedores', icon: 'truck', color: '#f97316', totalMonth: 4200.00 },
];

const iconMap: Record<string, any> = {
  'shopping-cart': ShoppingCart, 'wine': Wine, 'beef': Beef,
  'trending-up': TrendingUp, 'truck': Truck, 'utensils': Utensils, 'package': Package,
};

const colorOptions = [
  { value: '#3b82f6', label: 'Azul' }, { value: '#8b5cf6', label: 'Roxo' },
  { value: '#ef4444', label: 'Vermelho' }, { value: '#22c55e', label: 'Verde' },
  { value: '#f97316', label: 'Laranja' }, { value: '#ec4899', label: 'Rosa' },
  { value: '#eab308', label: 'Amarelo' }, { value: '#14b8a6', label: 'Teal' },
];

const iconOptions = [
  { value: 'shopping-cart', label: 'Carrinho', Icon: ShoppingCart },
  { value: 'wine', label: 'Bebidas', Icon: Wine },
  { value: 'beef', label: 'Carnes', Icon: Beef },
  { value: 'trending-up', label: 'Investimento', Icon: TrendingUp },
  { value: 'truck', label: 'Fornecedor', Icon: Truck },
  { value: 'utensils', label: 'Restaurante', Icon: Utensils },
  { value: 'package', label: 'Produtos', Icon: Package },
];

const FinancesScreen = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ExpenseCategory[]>(initialCategories);
  const [isOpen, setIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', icon: 'shopping-cart', color: '#3b82f6' });

  const totalGeral = categories.reduce((sum, cat) => sum + cat.totalMonth, 0);

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    const category: ExpenseCategory = { id: Date.now().toString(), name: newCategory.name, icon: newCategory.icon, color: newCategory.color, totalMonth: 0 };
    setCategories([...categories, category]);
    setNewCategory({ name: '', icon: 'shopping-cart', color: '#3b82f6' });
    setIsOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <PageHeader title="Finanças" showBack />

      <div style={{ padding: 16, maxWidth: 512, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="glass-card">
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>Total do Mês</p>
          <p className="money-display" style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-danger)', margin: 0 }}>{formatCurrency(totalGeral)}</p>
        </div>

        <Button block icon={<Plus style={{ width: 16, height: 16 }} />} onClick={() => setIsOpen(true)}>Registrar Categoria</Button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Categorias</h2>
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon] || Package;
            return (
              <div key={category.id} className="glass-card card-interactive" onClick={() => navigate(`/settings/finances/${category.id}`, { state: { category } })}
                style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                <div style={{ padding: 12, borderRadius: 12, background: category.color }}>
                  <IconComponent style={{ width: 20, height: 20, color: 'white' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, margin: 0 }}>{category.name}</p>
                  <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>
                    Este mês: <span className="money-display" style={{ color: 'var(--color-danger)' }}>{formatCurrency(category.totalMonth)}</span>
                  </p>
                </div>
                <ChevronRight style={{ width: 20, height: 20, color: 'var(--color-text-secondary)' }} />
              </div>
            );
          })}
        </div>
      </div>

      <Modal open={isOpen} onCancel={() => setIsOpen(false)} title="Nova Categoria" footer={[
        <Button key="add" type="primary" onClick={handleAddCategory} block>Adicionar Categoria</Button>,
      ]}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 16 }}>
          <div><label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Nome da Categoria</label><Input placeholder="Ex: Mercado, Bebidas..." value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} /></div>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Ícone</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {iconOptions.map((opt) => (
                <button key={opt.value} onClick={() => setNewCategory({ ...newCategory, icon: opt.value })}
                  style={{ padding: 8, borderRadius: 8, border: `1px solid ${newCategory.icon === opt.value ? 'var(--color-primary)' : 'var(--color-border)'}`, background: newCategory.icon === opt.value ? 'rgba(45,184,164,0.2)' : 'transparent', cursor: 'pointer', color: 'var(--color-text)', display: 'flex' }}>
                  <opt.Icon style={{ width: 20, height: 20 }} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Cor</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {colorOptions.map((opt) => (
                <button key={opt.value} onClick={() => setNewCategory({ ...newCategory, color: opt.value })}
                  style={{ width: 32, height: 32, borderRadius: '50%', background: opt.value, border: 'none', cursor: 'pointer', outline: newCategory.color === opt.value ? '2px solid var(--color-primary)' : 'none', outlineOffset: 2 }} />
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FinancesScreen;
