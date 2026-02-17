import { AvatarInitials } from '@/components/AvatarInitials';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { PageHeader } from '@/components/PageHeader';
import { VoucherItemCard } from '@/components/VoucherItemCard';
import { useEmployee, useFindEmployee } from '@/hooks/useEmployee';
import { calculateTotalVauchers } from '@/utils/calculate';
import { App, Button, Card, Input, InputNumber, Modal, Spin } from 'antd';
import {
  AlertCircle,
  CreditCard,
  DollarSign,
  History,
  Plus,
  ShoppingBag,
  User
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EmployeeManagementScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { addVoucher } = useEmployee();

  const { data: employee, isLoading } = useFindEmployee(id);

  const [cashModalOpen, setCashModalOpen] = useState(false);
  const [cashDescription, setCashDescription] = useState('');
  const [cashValue, setCashValue] = useState<number | null>(null);
  const [cashLoading, setCashLoading] = useState(false);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <AlertCircle style={{ width: 48, height: 48, color: 'var(--danger)' }} />
        <p style={{ fontSize: 18, fontWeight: 500 }}>Funcionário não encontrado</p>
        <Button onClick={() => navigate('/')}>Voltar</Button>
      </div>
    );
  }

  const voucherTotal = calculateTotalVauchers(employee?.vales);

  const handleCashVoucherSubmit = async () => {
    if (!cashDescription.trim()) {
      message.warning('Preencha a descrição');
      return;
    }
    if (!cashValue || cashValue <= 0) {
      message.warning('Informe um valor válido');
      return;
    }

    setCashLoading(true);
    try {
      await addVoucher.mutateAsync({
        props: {
          employeeId: employee.id,
          voucher: {
            id: crypto.randomUUID(),
            descricao: cashDescription.trim(),
            preco_unit: cashValue,
            quantidade: 1,
          },
        },
      });
      message.success('Vale em dinheiro adicionado');
      setCashModalOpen(false);
      setCashDescription('');
      setCashValue(null);
    } catch {
      message.error('Erro ao adicionar vale em dinheiro');
    } finally {
      setCashLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 32 }}>
      <PageHeader
        title={employee?.nome}
        subtitle={employee?.cargo}
        showBack
      />

      <div style={{ padding: '16px', maxWidth: 512, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Employee Header */}
        <Card className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <AvatarInitials name={employee?.nome} size="lg" />
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{employee?.nome}</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{employee?.cargo}</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                {employee?.tipo === 'DIARISTA' ? 'Diarista' : 'Fixo (Quinzenas)'}
              </p>
            </div>
          </div>
        </Card>

        {/* Cash Voucher Button */}
        <Button
          block
          size="large"
          icon={<DollarSign style={{ width: 18, height: 18 }} />}
          onClick={() => setCashModalOpen(true)}
          style={{ height: 48 }}
        >
          Adicionar Vale em Dinheiro
        </Button>

        {/* Current Voucher Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
              <ShoppingBag style={{ width: 20, height: 20, color: 'var(--primary)' }} />
              Vale Atual
            </h3>
            <Button
              type="primary"
              size="small"
              icon={<Plus style={{ width: 16, height: 16 }} />}
              onClick={() => navigate(`/menu/${employee?.id}`)}
            >
              Itens
            </Button>
          </div>

          {employee?.vales.length > 0 ? (
            <div style={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 4 }}>
              {employee?.vales.map((item) => (
                <VoucherItemCard
                  key={item.id}
                  item={item}
                  employeeId={employee.id}
                />
              ))}
            </div>
          ) : (
            <Card className="glass-card" style={{ textAlign: 'center' }}>
              <ShoppingBag style={{ width: 32, height: 32, color: 'var(--text-secondary)', margin: '0 auto 8px' }} />
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Nenhum item no vale</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                Toque em "+ Itens" para adicionar
              </p>
            </Card>
          )}

          {/* Voucher Total */}
          <Card style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 500 }}>Total do Vale</span>
              <MoneyDisplay
                value={voucherTotal}
                size="lg"
                variant={voucherTotal > 0 ? 'negative' : 'default'}
              />
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 16 }}>
          <Button
            type="primary"
            block
            size="large"
            icon={<CreditCard style={{ width: 20, height: 20 }} />}
            onClick={() => navigate(`/payment`, { state: employee })}
            style={{ height: 48 }}
          >
            Pagar Funcionário
          </Button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Button
              size="large"
              icon={<User style={{ width: 16, height: 16 }} />}
              onClick={() => navigate(`/employee/${employee?.id}/details`)}
              style={{ height: 48 }}
            >
              Ver Detalhes
            </Button>

            <Button
              size="large"
              icon={<History style={{ width: 16, height: 16 }} />}
              onClick={() => navigate(`/employee/${employee?.id}/history`)}
              style={{ height: 48 }}
            >
              Histórico
            </Button>
          </div>
        </div>
      </div>

      {/* Cash Voucher Modal */}
      <Modal
        title="Adicionar Vale em Dinheiro"
        open={cashModalOpen}
        onCancel={() => {
          setCashModalOpen(false);
          setCashDescription('');
          setCashValue(null);
        }}
        onOk={handleCashVoucherSubmit}
        confirmLoading={cashLoading}
        okText="Confirmar"
        cancelText="Cancelar"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Descrição</label>
            <Input
              placeholder="Ex: Adiantamento, empréstimo..."
              value={cashDescription}
              onChange={(e) => setCashDescription(e.target.value)}
              maxLength={100}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Valor (R$)</label>
            <InputNumber
              placeholder="0,00"
              value={cashValue}
              onChange={(val) => setCashValue(val)}
              min={0.01}
              step={0.5}
              precision={2}
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace('.', ',')}
              parser={(value) => Number(value?.replace(',', '.') || 0)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeManagementScreen;
