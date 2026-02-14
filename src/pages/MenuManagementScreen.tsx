import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { Button, Input, Modal, App, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '@/context/EmployeeContext';
import { MenuProduct } from '@/types';
import { parseCurrencyInput } from '@/utils/format';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

const MenuManagementScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useEmployees();
  const { menuProducts } = state;
  const { message, modal } = App.useApp();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MenuProduct | null>(null);

  const [formData, setFormData] = useState({ name: '', category: '', price: '', available: true });

  const resetForm = () => { setFormData({ name: '', category: '', price: '', available: true }); setEditingProduct(null); };

  const openAddDialog = () => { resetForm(); setShowAddDialog(true); };
  const openEditDialog = (product: MenuProduct) => {
    setFormData({ name: product.name, category: product.category, price: product.price.toString().replace('.', ','), available: product.available });
    setEditingProduct(product);
    setShowAddDialog(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.category.trim() || !formData.price) { message.error('Preencha todos os campos'); return; }
    const price = parseCurrencyInput(formData.price);
    if (price <= 0) { message.error('Preço deve ser maior que zero'); return; }

    if (editingProduct) {
      dispatch({ type: 'UPDATE_MENU_PRODUCT', payload: { ...editingProduct, name: formData.name.trim(), category: formData.category.trim(), price, available: formData.available } });
      message.success('Produto atualizado');
    } else {
      dispatch({ type: 'ADD_MENU_PRODUCT', payload: { id: `prod-${Date.now()}`, name: formData.name.trim(), category: formData.category.trim(), price, available: formData.available } });
      message.success('Produto adicionado');
    }
    setShowAddDialog(false);
    resetForm();
  };

  const handleDelete = (productId: string) => {
    modal.confirm({
      title: 'Remover Produto',
      content: 'Tem certeza que deseja remover este produto do cardápio?',
      okText: 'Remover',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: () => { dispatch({ type: 'DELETE_MENU_PRODUCT', payload: productId }); message.success('Produto removido'); },
    });
  };

  const categories = [...new Set(menuProducts.map((p) => p.category))];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 32 }}>
      <PageHeader
        title="Gerenciar Cardápio"
        subtitle="Adicione ou edite produtos"
        showBack
        rightAction={<Button type="primary" size="small" icon={<Plus style={{ width: 16, height: 16 }} />} onClick={openAddDialog}>Novo</Button>}
      />

      <div style={{ padding: 16, maxWidth: 512, margin: '0 auto' }}>
        {categories.length > 0 ? categories.map((category) => (
          <div key={category} style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>{category}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {menuProducts.filter((p) => p.category === category).map((product) => (
                <div key={product.id} className="glass-card" style={{ opacity: product.available ? 1 : 0.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 500, margin: 0 }}>{product.name}</p>
                    <MoneyDisplay value={product.price} size="sm" />
                    {!product.available && <span style={{ fontSize: 12, color: 'var(--color-warning)' }}> Indisponível</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Button type="text" icon={<Edit style={{ width: 16, height: 16 }} />} onClick={() => openEditDialog(product)} />
                    <Button type="text" danger icon={<Trash2 style={{ width: 16, height: 16 }} />} onClick={() => handleDelete(product.id)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Package style={{ width: 48, height: 48, color: 'var(--color-text-secondary)', margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--color-text-secondary)' }}>Nenhum produto cadastrado</p>
            <Button type="primary" icon={<Plus style={{ width: 16, height: 16 }} />} onClick={openAddDialog} style={{ marginTop: 16 }}>Adicionar Produto</Button>
          </div>
        )}
      </div>

      <Modal
        open={showAddDialog}
        onCancel={() => setShowAddDialog(false)}
        title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
        footer={[
          <Button key="cancel" onClick={() => setShowAddDialog(false)}>Cancelar</Button>,
          <Button key="save" type="primary" onClick={handleSave}>{editingProduct ? 'Salvar' : 'Adicionar'}</Button>,
        ]}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 0' }}>
          <div><label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Nome do Produto</label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Marmita Grande" /></div>
          <div><label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Categoria</label><Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Ex: Refeições" /></div>
          <div><label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Preço</label><Input prefix="R$" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value.replace(/[^\d,]/g, '') })} placeholder="0,00" inputMode="decimal" /></div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ fontSize: 14, fontWeight: 500 }}>Disponível no cardápio</label>
            <Switch checked={formData.available} onChange={(checked) => setFormData({ ...formData, available: checked })} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MenuManagementScreen;
