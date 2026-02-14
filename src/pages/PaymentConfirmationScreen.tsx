import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '@/context/EmployeeContext';
import { PageHeader } from '@/components/PageHeader';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { VoucherItemCard } from '@/components/VoucherItemCard';
import { Button, Modal, App } from 'antd';
import { Payment } from '@/types';
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <AlertCircle style={{ width: 48, height: 48, color: 'var(--color-danger)', margin: '0 auto 16px' }} />
          <p style={{ fontSize: 18, fontWeight: 500 }}>Erro ao carregar pagamento</p>
          <Button onClick={() => navigate('/')} style={{ marginTop: 16 }}>Voltar</Button>
        </div>
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

    dispatch({ type: 'CONFIRM_PAYMENT', payload: { employeeId: employee.id, payment } });
    setIsProcessing(false);
    setShowConfirmModal(false);
    message.success('Pagamento confirmado com sucesso!');
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 32 }}>
      <PageHeader title="Confirmar Pagamento" subtitle={employee.name} showBack />

      <div style={{ padding: 16, maxWidth: 512, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Salary */}
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ padding: 8, borderRadius: '50%', background: 'rgba(45, 184, 164, 0.2)' }}>
              <Wallet style={{ width: 20, height: 20, color: 'var(--color-primary)' }} />
            </div>
            <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Salário Base</span>
          </div>
          <MoneyDisplay value={paymentDetails.baseSalary} size="xl" />
        </div>

        {/* Voucher */}
        <div className="glass-card" style={{ padding: 20, border: '1px solid rgba(217, 54, 54, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ padding: 8, borderRadius: '50%', background: 'rgba(217, 54, 54, 0.2)' }}>
              <Receipt style={{ width: 20, height: 20, color: 'var(--color-danger)' }} />
            </div>
            <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Total do Vale a Descontar</span>
          </div>
          <MoneyDisplay value={-paymentDetails.voucherTotal} size="xl" variant="negative" />
          
          {employee.currentVoucher.length > 0 && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {employee.currentVoucher.map((item) => (
                <VoucherItemCard key={item.id} item={item} showControls={false} bgColor="rgba(217, 54, 54, 0.05)" />
              ))}
            </div>
          )}
        </div>

        {/* Total */}
        <div style={{ padding: 24, borderRadius: 12, background: 'rgba(45, 184, 106, 0.1)', border: '1px solid rgba(45, 184, 106, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ padding: 8, borderRadius: '50%', background: 'rgba(45, 184, 106, 0.2)' }}>
              <Banknote style={{ width: 20, height: 20, color: 'var(--color-success)' }} />
            </div>
            <span style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: 18 }}>Total a Pagar</span>
          </div>
          <MoneyDisplay value={paymentDetails.amountPaid} size="xl" variant="positive" />
        </div>

        <Button
          type="primary"
          block
          size="large"
          icon={<CheckCircle style={{ width: 20, height: 20 }} />}
          onClick={() => setShowConfirmModal(true)}
          style={{ height: 56, fontSize: 18, marginTop: 24, background: 'var(--color-success)', borderColor: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          Confirmar Pagamento
        </Button>
      </div>

      <Modal
        open={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        title="Confirmar Pagamento"
        footer={[
          <Button key="cancel" onClick={() => setShowConfirmModal(false)} disabled={isProcessing}>Cancelar</Button>,
          <Button key="confirm" type="primary" onClick={handleConfirmPayment} loading={isProcessing} style={{ background: 'var(--color-success)', borderColor: 'var(--color-success)' }}>
            {isProcessing ? 'Processando...' : 'Confirmar'}
          </Button>,
        ]}
      >
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Você está prestes a confirmar o pagamento de <strong style={{ color: 'var(--color-text)' }}>{employee.name}</strong>.
        </p>
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 8 }}>Valor a ser pago:</p>
          <MoneyDisplay value={paymentDetails.amountPaid} size="xl" variant="positive" />
        </div>
        <div style={{ padding: 12, background: 'rgba(242, 166, 13, 0.1)', border: '1px solid rgba(242, 166, 13, 0.3)', borderRadius: 8 }}>
          <p style={{ fontSize: 14, color: 'var(--color-warning)', textAlign: 'center', margin: 0 }}>
            ⚠️ O vale será zerado após a confirmação
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentConfirmationScreen;
