import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/format';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Plus,
  ShoppingCart,
  Wine,
  Beef,
  TrendingUp,
  Truck,
  Utensils,
  Package,
  ChevronRight,
} from 'lucide-react';

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  totalMonth: number;
}

export interface Expense {
  id: string;
  categoryId: string;
  description: string;
  amount: number;
  date: Date;
}

// Mock data
const initialCategories: ExpenseCategory[] = [
  { id: '1', name: 'Mercado', icon: 'shopping-cart', color: 'bg-blue-500', totalMonth: 2450.00 },
  { id: '2', name: 'Bebidas', icon: 'wine', color: 'bg-purple-500', totalMonth: 890.50 },
  { id: '3', name: 'Carnes', icon: 'beef', color: 'bg-red-500', totalMonth: 1560.00 },
  { id: '4', name: 'Investimentos', icon: 'trending-up', color: 'bg-green-500', totalMonth: 3000.00 },
  { id: '5', name: 'Fornecedores', icon: 'truck', color: 'bg-orange-500', totalMonth: 4200.00 },
];

const iconMap: Record<string, any> = {
  'shopping-cart': ShoppingCart,
  'wine': Wine,
  'beef': Beef,
  'trending-up': TrendingUp,
  'truck': Truck,
  'utensils': Utensils,
  'package': Package,
};

const colorOptions = [
  { value: 'bg-blue-500', label: 'Azul' },
  { value: 'bg-purple-500', label: 'Roxo' },
  { value: 'bg-red-500', label: 'Vermelho' },
  { value: 'bg-green-500', label: 'Verde' },
  { value: 'bg-orange-500', label: 'Laranja' },
  { value: 'bg-pink-500', label: 'Rosa' },
  { value: 'bg-yellow-500', label: 'Amarelo' },
  { value: 'bg-teal-500', label: 'Teal' },
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
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: 'shopping-cart',
    color: 'bg-blue-500',
  });

  const totalGeral = categories.reduce((sum, cat) => sum + cat.totalMonth, 0);

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;

    const category: ExpenseCategory = {
      id: Date.now().toString(),
      name: newCategory.name,
      icon: newCategory.icon,
      color: newCategory.color,
      totalMonth: 0,
    };

    setCategories([...categories, category]);
    setNewCategory({ name: '', icon: 'shopping-cart', color: 'bg-blue-500' });
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Finanças" showBack />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Total do Mês */}
        <Card className="p-4 glass-card border-border">
          <p className="text-sm text-muted-foreground">Total do Mês</p>
          <p className="text-2xl font-bold text-danger font-mono">
            {formatCurrency(totalGeral)}
          </p>
        </Card>

        {/* Add Category Button */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Registrar Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Nova Categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Nome da Categoria
                </label>
                <Input
                  placeholder="Ex: Mercado, Bebidas..."
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Ícone
                </label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setNewCategory({ ...newCategory, icon: opt.value })}
                      className={`p-2 rounded-lg border transition-colors ${
                        newCategory.icon === opt.value
                          ? 'border-primary bg-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <opt.Icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Cor
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setNewCategory({ ...newCategory, color: opt.value })}
                      className={`w-8 h-8 rounded-full ${opt.value} ${
                        newCategory.color === opt.value
                          ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                          : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <Button onClick={handleAddCategory} className="w-full">
                Adicionar Categoria
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Categories List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Categorias</h2>
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon] || Package;
            return (
              <Card
                key={category.id}
                className="p-4 glass-card border-border cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => navigate(`/settings/finances/${category.id}`, { 
                  state: { category } 
                })}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${category.color}`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Este mês: <span className="text-danger font-mono">{formatCurrency(category.totalMonth)}</span>
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FinancesScreen;
