import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '@/context/EmployeeContext';
import { PageHeader } from '@/components/PageHeader';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MenuProduct } from '@/types';
import { parseCurrencyInput } from '@/utils/format';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Package, AlertCircle } from 'lucide-react';

const MenuManagementScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useEmployees();
  const { menuProducts } = state;

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MenuProduct | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    available: true,
  });

  const resetForm = () => {
    setFormData({ name: '', category: '', price: '', available: true });
    setEditingProduct(null);
  };

  const openAddDialog = () => {
    resetForm();
    setShowAddDialog(true);
  };

  const openEditDialog = (product: MenuProduct) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString().replace('.', ','),
      available: product.available,
    });
    setEditingProduct(product);
    setShowAddDialog(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.category.trim() || !formData.price) {
      toast.error('Preencha todos os campos');
      return;
    }

    const price = parseCurrencyInput(formData.price);
    if (price <= 0) {
      toast.error('Preço deve ser maior que zero');
      return;
    }

    if (editingProduct) {
      dispatch({
        type: 'UPDATE_MENU_PRODUCT',
        payload: {
          ...editingProduct,
          name: formData.name.trim(),
          category: formData.category.trim(),
          price,
          available: formData.available,
        },
      });
      toast.success('Produto atualizado');
    } else {
      dispatch({
        type: 'ADD_MENU_PRODUCT',
        payload: {
          id: `prod-${Date.now()}`,
          name: formData.name.trim(),
          category: formData.category.trim(),
          price,
          available: formData.available,
        },
      });
      toast.success('Produto adicionado');
    }

    setShowAddDialog(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deleteProductId) {
      dispatch({ type: 'DELETE_MENU_PRODUCT', payload: deleteProductId });
      toast.success('Produto removido');
      setDeleteProductId(null);
    }
  };

  const categories = [...new Set(menuProducts.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-background pb-8">
      <PageHeader
        title="Gerenciar Cardápio"
        subtitle="Adicione ou edite produtos"
        showBack
        rightAction={
          <Button size="sm" onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-1" />
            Novo
          </Button>
        }
      />

      <div className="px-4 py-4 max-w-lg mx-auto">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {menuProducts
                  .filter((p) => p.category === category)
                  .map((product) => (
                    <Card
                      key={product.id}
                      className={`p-4 glass-card border-border ${
                        !product.available ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <MoneyDisplay value={product.price} size="sm" />
                          {!product.available && (
                            <span className="text-xs text-warning">
                              Indisponível
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-danger hover:text-danger"
                            onClick={() => setDeleteProductId(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum produto cadastrado</p>
            <Button className="mt-4" onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Produto
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Nome do Produto</Label>
              <Input
                id="productName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Marmita Grande"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productCategory">Categoria</Label>
              <Input
                id="productCategory"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="Ex: Refeições"
                list="categories"
              />
              <datalist id="categories">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productPrice">Preço</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input
                  id="productPrice"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: e.target.value.replace(/[^\d,]/g, ''),
                    })
                  }
                  placeholder="0,00"
                  className="pl-10"
                  inputMode="decimal"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="productAvailable">Disponível no cardápio</Label>
              <Switch
                id="productAvailable"
                checked={formData.available}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, available: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingProduct ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteProductId}
        onOpenChange={() => setDeleteProductId(null)}
      >
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Produto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este produto do cardápio?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-danger hover:bg-danger/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MenuManagementScreen;
