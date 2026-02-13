import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { Button, Input, Select } from 'antd';
import { formatCurrency, formatDate } from '@/utils/format';
import { ShoppingCart, Wine, Beef, TrendingUp, Truck, Utensils, Package, Plus, Calendar } from 'lucide-react';
import type { ExpenseCategory } from './FinancesScreen';

interface Expense { id: string; description: string; amount: number; date: Date; }

const iconMap: Record<string, any> = {
  'shopping-cart': ShoppingCart, 'wine': Wine, 'beef': Beef,
  'trending-up': TrendingUp, 'truck': Truck, 'utensils': Utensils, 'package': Package,
};

const mockExpenses: Record<string, Expense[]> = {
  '1': [{ id: '1', description: 'Arroz e Feijão', amount: 150.00, date: new Date('2026-01-10') }, { id: '2', description: 'Óleo e Temperos', amount: 85.50, date: new Date('2026-01-08') }, { id: '3', description: 'Produtos de Limpeza', amount: 120.00, date: new Date('2026-01-05') }],
  '2': [{ id: '1', description: 'Refrigerantes', amount: 320.00, date: new Date('2026-01-11') }, { id: '2', description: 'Cervejas', amount: 450.50, date: new Date('2026-01-09') }],
  '3': [{ id: '1', description: 'Picanha 10kg', amount: 890.00, date: new Date('2026-01-10') }, { id: '2', description: 'Frango 20kg', amount: 280.00, date: new Date('2026-01-07') }],
};

type PeriodFilter = 'month' | 'week' | 'all';

const CategoryExpensesScreen = () => {
  const location = useLocation();
  const category = location.state?.category as ExpenseCategory | undefined;
  const [expenses, setExpenses] = useState<Expense[]>(category ? mockExpenses[category.id] || [] : []);
  const [period, setPeriod] = useState<PeriodFilter>('month');
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' });

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    return expenses.filter((exp) => {
      const d = new Date(exp.date);
      if (period === 'week') { const w = new Date(now); w.setDate(w.getDate() - 7); return d >= w; }
      if (period === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      return true;
    });
  }, [expenses, period]);

  const totalFiltered = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddExpense = () => {
    if (!newExpense.description.trim() || !newExpense.amount) return;
    setExpenses([{ id: Date.now().toString(), description: newExpense.description, amount: parseFloat(newExpense.amount.replace(',', '.')), date: new Date() }, ...expenses]);
    setNewExpense({ description: '', amount: '' });
  };

  if (!category) {
    return (<div style={{ minHeight: '100vh', paddingBottom: 80 }}><PageHeader title="Categoria" showBack /><div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Categoria não encontrada</div></div>);
  }

  const IconComponent = iconMap[category.icon] || Package;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <PageHeader title={category.name} showBack />
      <div style={{ padding: 16, maxWidth: 512, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ padding: 12, borderRadius: 12, background: category.color }}><IconComponent style={{ width: 24, height: 24, color: 'white' }} /></div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>Total no período</p>
            <p className="money-display" style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-danger)', margin: 0 }}>{formatCurrency(totalFiltered)}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar style={{ width: 16, height: 16, color: 'var(--color-text-secondary)' }} />
          <Select value={period} onChange={(v) => setPeriod(v as PeriodFilter)} style={{ width: '100%' }}
            options={[{ value: 'week', label: 'Última semana' }, { value: 'month', label: 'Este mês' }, { value: 'all', label: 'Todo o histórico' }]} />
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}><Plus style={{ width: 16, height: 16 }} />Nova Despesa</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input placeholder="Descrição" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} style={{ flex: 1 }} />
            <Input placeholder="R$ 0,00" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} style={{ width: 112 }} inputMode="decimal" />
          </div>
          <Button type="primary" block size="small" onClick={handleAddExpense}>Adicionar</Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h3 style={{ fontWeight: 600, color: 'var(--color-text-secondary)', margin: 0 }}>Despesas ({filteredExpenses.length})</h3>
          {filteredExpenses.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: 24, color: 'var(--color-text-secondary)' }}>Nenhuma despesa neste período</div>
          ) : filteredExpenses.map((exp) => (
            <div key={exp.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div><p style={{ fontWeight: 500, margin: 0 }}>{exp.description}</p><p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0 }}>{formatDate(exp.date)}</p></div>
              <p className="money-display" style={{ color: 'var(--color-danger)', fontWeight: 600, margin: 0 }}>{formatCurrency(exp.amount)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryExpensesScreen;
