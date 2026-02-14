import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '@/context/EmployeeContext';
import { PageHeader } from '@/components/PageHeader';
import { AvatarInitials } from '@/components/AvatarInitials';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { VoucherItemCard } from '@/components/VoucherItemCard';
import { Button, Card, App } from 'antd';
import { Plus, CreditCard, User, History, ShoppingBag, AlertCircle } from 'lucide-react';

const EmployeeManagementScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEmployee, getVoucherTotal, dispatch } = useEmployees();
  const { message } = App.useApp();

  const employee = getEmployee(id || '');

  if (!employee) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <AlertCircle style={{ width: 48, height: 48, color: 'var(--color-danger)', margin: '0 auto 16px' }} />
          <p style={{ fontSize: 18, fontWeight: 500 }}>Funcionário não encontrado</p>
          <Button onClick={() => navigate('/')} style={{ marginTop: 16 }}>Voltar</Button>
        </div>
      </div>
    );
  }

  const voucherTotal = getVoucherTotal(employee.id);

  const handleRemoveItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_VOUCHER_ITEM', payload: { employeeId: employee.id, itemId } });
    message.success('Item removido do vale');
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 32 }}>
      <PageHeader title={employee.name} subtitle={employee.role} showBack />

      <div style={{ padding: 16, maxWidth: 512, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Employee Header */}
        <div className="glass-card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <AvatarInitials name={employee.name} size="lg" />
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{employee.name}</h2>
              <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>{employee.role}</p>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>
                {employee.type === 'DIARISTA' ? 'Diarista' : 'Fixo (Quinzenas)'}
              </p>
            </div>
          </div>
        </div>

        {/* Voucher */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
              <ShoppingBag style={{ width: 20, height: 20, color: 'var(--color-primary)' }} />
              Vale Atual
            </h3>
            <Button type="primary" size="small" icon={<Plus style={{ width: 16, height: 16 }} />} onClick={() => navigate(`/menu/${employee.id}`)}>
              Itens
            </Button>
          </div>

          {employee.currentVoucher.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {employee.currentVoucher.map((item) => (
                <VoucherItemCard key={item.id} item={item} onRemove={() => handleRemoveItem(item.id)} />
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: 24 }}>
              <ShoppingBag style={{ width: 32, height: 32, color: 'var(--color-text-secondary)', margin: '0 auto 8px' }} />
              <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Nenhum item no vale</p>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>Toque em "+ Itens" para adicionar</p>
            </div>
          )}

          <div className="glass-card" style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 500 }}>Total do Vale</span>
            <MoneyDisplay value={voucherTotal} size="lg" variant={voucherTotal > 0 ? 'negative' : 'default'} />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 16 }}>
          <Button
            type="primary"
            block
            size="large"
            icon={<CreditCard style={{ width: 20, height: 20 }} />}
            onClick={() => navigate(`/payment/${employee.id}`)}
            disabled={employee.currentVoucher.length === 0 && voucherTotal === 0}
            style={{ height: 48, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            Pagar Funcionário
          </Button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Button block size="large" icon={<User style={{ width: 16, height: 16 }} />} onClick={() => navigate(`/employee/${employee.id}/details`)} style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              Ver Detalhes
            </Button>
            <Button block size="large" icon={<History style={{ width: 16, height: 16 }} />} onClick={() => navigate(`/employee/${employee.id}/history`)} style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              Histórico
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagementScreen;
