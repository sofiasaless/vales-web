import { MoneyDisplay } from '@/components/MoneyDisplay';
import { PageHeader } from '@/components/PageHeader';
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
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useListMenu, useMenu } from '@/hooks/useMenu';
import { ItemMenuPostRequestBody, ItemMenuResponseBody } from '@/types/menu.type';
import { onChangeNumberInput, onKeyDownNumberInput, parseCurrencyInput } from '@/utils/format';
import { Edit, Package, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const MenuManagementScreen = () => {
  const { data: menuProducts, isLoading } = useListMenu()
  const { add, remove, update } = useMenu()

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ItemMenuResponseBody | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const [formData, setFormData] = useState<{descricao: string, preco: number}>({
    descricao: '',
    preco: 0
  });

  const resetForm = () => {
    setFormData({ descricao: '', preco: 0 });
    setEditingProduct(null);
  };

  const openAddDialog = () => {
    resetForm();
    setShowAddDialog(true);
  };

  const openEditDialog = (product: ItemMenuResponseBody) => {
    setFormData({
      descricao: product.descricao,
      preco: product.preco
    });
    setEditingProduct(product);
    setShowAddDialog(true);
  };

  const handleSave = async () => {
    if (!formData.descricao.trim() || !formData.preco) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (formData.preco <= 0) {
      toast.error('Preço deve ser maior que zero');
      return;
    }
    
    const toSend: ItemMenuPostRequestBody = {
      descricao: formData.descricao,
      preco: formData.preco
    }

    if (editingProduct) {
      await update.mutateAsync({itemId: editingProduct.id, payload: toSend})
      toast.success('Produto atualizado');
    } else {
      await add.mutateAsync({body: toSend})
      toast.success('Produto adicionado');
    }

    setShowAddDialog(false);
    resetForm();
  };

  const handleDelete = async () => {
    if (deleteProductId) {
      await remove.mutateAsync({itemId: deleteProductId})
      toast.success('Produto removido');
      setDeleteProductId(null);
    }
  };

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
        {(menuProducts?.length > 0) ?
          menuProducts?.map((product) => (
            <div className="space-y-2 my-3">
              <Card
                key={product.id}
                className={`p-4 glass-card border-border`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{product.descricao}</p>
                    <MoneyDisplay value={product.preco} size="sm" />
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
            </div>
          ))
          :
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum produto cadastrado</p>
            <Button disabled={add.isPending} className="mt-4" onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Produto
            </Button>
          </div>
        }
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
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                placeholder="Ex: Marmita Grande"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productPrice">Preço</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input
                  id="productPrice"
                  value={formData.preco}
                  onKeyDown={onKeyDownNumberInput}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preco: onChangeNumberInput(e),
                    })
                  }
                  placeholder="0,00"
                  className="pl-10"
                  inputMode="decimal"
                />
              </div>
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
