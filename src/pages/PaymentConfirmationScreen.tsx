import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '@/context/EmployeeContext';
import { PageHeader } from '@/components/PageHeader';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { App, Button, Card, Modal } from 'antd';
import { Payment, VoucherItem } from '@/types';
import { CheckCircle, AlertCircle, Wallet, Receipt, Banknote } from 'lucide-react';

const PaymentConfirmationScreen = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const { getEmployee, calculatePayment, dispatch } = useEmployees();
  const { message } = App.useApp();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const employee = getEmployee(employeeId || '');
  const paymentDetails = calculatePayment(employeeId || '');

  if (!employee || !paymentDetails) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <AlertCircle style={{ width: 48, height: 48, color: 'var(--danger)' }} />
        <p style={{ fontSize: 18, fontWeight: 500 }}>Erro ao carregar pagamento</p>
        <Button onClick={() => navigate('/')}>Voltar</Button>
      </div>
    );
  }

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const payment: Payment = {
      id: `pay-${Date.now()}`,
      employeeId: employee.id,
      date: new Date(),
      baseSalary: paymentDetails.baseSalary,
      voucherTotal: paymentDetails.voucherTotal,
      amountPaid: paymentDetails.amountPaid,
      voucherItems: [...employee.currentVoucher],
    };

    dispatch({
      type: 'CONFIRM_PAYMENT',
      payload: { employeeId: employee.id, payment },
    });

    setIsProcessing(false);
    setShowConfirmModal(false);
    message.success('Pagamento confirmado com sucesso!');
    navigate('/');
  };

  const renderVoucherItem = (item: VoucherItem) => (
    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, background: 'var(--bg-secondary)' }}>
      <div>
        <p style={{ margin: 0, fontWeight: 500 }}>{item.name}</p>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
          {item.quantity}x <MoneyDisplay value={item.unitPrice} size="sm" />
        </p>
      </div>
      <MoneyDisplay value={item.unitPrice * item.quantity} size="md" />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 32 }}>
      <PageHeader title="Confirmar Pagamento" subtitle={employee.name} showBack />

      <div style={{ padding: 16, maxWidth: 512, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ padding: 8, borderRadius: '50%', background: 'var(--primary-bg)' }}>
              <Wallet style={{ width: 20, height: 20, color: 'var(--primary)' }} />
            </div>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Salário Base</span>
          </div>
          <MoneyDisplay value={paymentDetails.baseSalary} size="xl" />
        </Card>

        <Card className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ padding: 8, borderRadius: '50%', background: 'rgba(239,68,68,0.2)' }}>
              <Receipt style={{ width: 20, height: 20, color: 'var(--danger)' }} />
            </div>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Total do Vale a Descontar</span>
          </div>
          <MoneyDisplay value={-paymentDetails.voucherTotal} size="xl" variant="negative" />

          {employee.currentVoucher.length > 0 && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {employee.currentVoucher.map(renderVoucherItem)}
            </div>
          )}
        </Card>

        <Card style={{ background: 'rgba(34,197,94,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ padding: 8, borderRadius: '50%', background: 'rgba(34,197,94,0.2)' }}>
              <Banknote style={{ width: 20, height: 20, color: 'var(--success)' }} />
            </div>
            <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: 18 }}>Total a Pagar</span>
          </div>
          <MoneyDisplay value={paymentDetails.amountPaid} size="xl" variant="positive" />
        </Card>

        <Button
          type="primary"
          block
          size="large"
          icon={<CheckCircle style={{ width: 20, height: 20 }} />}
          onClick={() => setShowConfirmModal(true)}
          style={{ height: 56, fontSize: 16, marginTop: 8, background: 'var(--success)' }}
        >
          Confirmar Pagamento
        </Button>
      </div>

      <Modal
        title="Confirmar Pagamento"
        open={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onOk={handleConfirmPayment}
        confirmLoading={isProcessing}
        okText="Confirmar"
        cancelText="Cancelar"
      >
        <p style={{ color: 'var(--text-secondary)' }}>
          Você está prestes a confirmar o pagamento de <strong>{employee.name}</strong>.
        </p>
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>Valor a ser pago:</p>
          <MoneyDisplay value={paymentDetails.amountPaid} size="xl" variant="positive" />
        </div>
        <div style={{ padding: 12, background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: 8, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--warning)', margin: 0 }}>
            ⚠️ O vale será zerado após a confirmação
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentConfirmationScreen;
