import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '@/context/EmployeeContext';
import { PageHeader } from '@/components/PageHeader';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { formatDateTime } from '@/utils/format';
import { History, AlertCircle, Receipt, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Button, Card } from 'antd';
import { VoucherItem } from '@/types';

const PaymentHistoryScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEmployee } = useEmployees();

  const employee = getEmployee(id || '');
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);

  if (!employee) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <AlertCircle style={{ width: 48, height: 48, color: 'var(--danger)' }} />
        <p style={{ fontSize: 18, fontWeight: 500 }}>Funcionário não encontrado</p>
        <Button onClick={() => navigate('/')}>Voltar</Button>
      </div>
    );
  }

  const toggleExpand = (paymentId: string) => {
    setExpandedPayment((prev) => (prev === paymentId ? null : paymentId));
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
      <PageHeader title="Histórico de Pagamentos" subtitle={employee.name} showBack />

      <div style={{ padding: 16, maxWidth: 512, margin: '0 auto' }}>
        {employee.paymentHistory.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {employee.paymentHistory.map((payment) => {
              const isExpanded = expandedPayment === payment.id;

              return (
                <Card key={payment.id} className="glass-card" style={{ cursor: 'pointer' }} onClick={() => toggleExpand(payment.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                        {formatDateTime(payment.date)}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <MoneyDisplay value={payment.amountPaid} size="lg" variant="positive" />
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>pago</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>Vale descontado</p>
                        <MoneyDisplay value={-payment.voucherTotal} size="sm" variant="negative" />
                      </div>
                      {isExpanded ? <ChevronUp style={{ width: 20, height: 20, color: 'var(--text-secondary)' }} /> : <ChevronDown style={{ width: 20, height: 20, color: 'var(--text-secondary)' }} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                        <div style={{ padding: 8, background: 'var(--bg-secondary)', borderRadius: 8 }}>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>Salário Base</p>
                          <MoneyDisplay value={payment.baseSalary} size="sm" />
                        </div>
                        <div style={{ padding: 8, background: 'rgba(239,68,68,0.1)', borderRadius: 8 }}>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>Desconto Vale</p>
                          <MoneyDisplay value={-payment.voucherTotal} size="sm" variant="negative" />
                        </div>
                      </div>

                      {payment.voucherItems.length > 0 && (
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Receipt style={{ width: 16, height: 16 }} />
                            Itens do Vale
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {payment.voucherItems.map(renderVoucherItem)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <History style={{ width: 48, height: 48, color: 'var(--text-secondary)', margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Nenhum pagamento registrado</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              O histórico aparecerá aqui após o primeiro pagamento
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryScreen;
