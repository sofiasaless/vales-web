import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate } from '@/utils/format';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ShoppingCart,
  Wine,
  Beef,
  TrendingUp,
  Truck,
  Utensils,
  Package,
  Plus,
  Calendar,
} from 'lucide-react';
import type { ExpenseCategory } from './FinancesScreen';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
}

const iconMap: Record<string, any> = {
  'shopping-cart': ShoppingCart,
  'wine': Wine,
  'beef': Beef,
  'trending-up': TrendingUp,
  'truck': Truck,
  'utensils': Utensils,
  'package': Package,
};

// Mock expenses
const mockExpenses: Record<string, Expense[]> = {
  '1': [
    { id: '1', description: 'Arroz e Feijão', amount: 150.00, date: new Date('2026-01-10') },
    { id: '2', description: 'Óleo e Temperos', amount: 85.50, date: new Date('2026-01-08') },
    { id: '3', description: 'Produtos de Limpeza', amount: 120.00, date: new Date('2026-01-05') },
  ],
  '2': [
    { id: '1', description: 'Refrigerantes', amount: 320.00, date: new Date('2026-01-11') },
    { id: '2', description: 'Cervejas', amount: 450.50, date: new Date('2026-01-09') },
  ],
  '3': [
    { id: '1', description: 'Picanha 10kg', amount: 890.00, date: new Date('2026-01-10') },
    { id: '2', description: 'Frango 20kg', amount: 280.00, date: new Date('2026-01-07') },
  ],
};

type PeriodFilter = 'month' | 'week' | 'all';

const CategoryExpensesScreen = () => {
  const location = useLocation();
  const category = location.state?.category as ExpenseCategory | undefined;
  
  const [expenses, setExpenses] = useState<Expense[]>(
    category ? mockExpenses[category.id] || [] : []
  );
  const [period, setPeriod] = useState<PeriodFilter>('month');
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' });

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      switch (period) {
        case 'week': {
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return expenseDate >= weekAgo;
        }
        case 'month': {
          return (
            expenseDate.getMonth() === now.getMonth() &&
            expenseDate.getFullYear() === now.getFullYear()
          );
        }
        default:
          return true;
      }
    });
  }, [expenses, period]);

  const totalFiltered = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddExpense = () => {
    if (!newExpense.description.trim() || !newExpense.amount) return;

    const expense: Expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount.replace(',', '.')),
      date: new Date(),
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({ description: '', amount: '' });
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <PageHeader title="Categoria" showBack />
        <div className="px-4 py-8 text-center text-muted-foreground">
          Categoria não encontrada
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[category.icon] || Package;

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title={category.name} showBack />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Category Header */}
        <Card className="p-4 glass-card border-border">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${category.color}`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Total no período</p>
              <p className="text-2xl font-bold text-danger font-mono">
                {formatCurrency(totalFiltered)}
              </p>
            </div>
          </div>
        </Card>

        {/* Period Filter */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Select value={period} onValueChange={(v) => setPeriod(v as PeriodFilter)}>
            <SelectTrigger className="w-full bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Este mês</SelectItem>
              <SelectItem value="all">Todo o histórico</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add Expense Form */}
        <Card className="p-4 glass-card border-border space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nova Despesa
          </h3>
          <div className="flex gap-2">
            <Input
              placeholder="Descrição"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              className="flex-1"
            />
            <Input
              placeholder="R$ 0,00"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="w-28"
              type="text"
              inputMode="decimal"
            />
          </div>
          <Button onClick={handleAddExpense} className="w-full" size="sm">
            Adicionar
          </Button>
        </Card>

        {/* Expenses List */}
        <div className="space-y-2">
          <h3 className="font-semibold text-muted-foreground">
            Despesas ({filteredExpenses.length})
          </h3>
          {filteredExpenses.length === 0 ? (
            <Card className="p-6 glass-card border-border text-center text-muted-foreground">
              Nenhuma despesa neste período
            </Card>
          ) : (
            filteredExpenses.map((expense) => (
              <Card
                key={expense.id}
                className="p-3 glass-card border-border flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{expense.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(expense.date)}
                  </p>
                </div>
                <p className="font-mono text-danger font-semibold">
                  {formatCurrency(expense.amount)}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryExpensesScreen;
