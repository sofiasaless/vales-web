import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '@/context/EmployeeContext';
import { PageHeader } from '@/components/PageHeader';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { VoucherItemCard } from '@/components/VoucherItemCard';
import { Button } from 'antd';
import { formatDateTime } from '@/utils/format';
import { History, AlertCircle, Receipt, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const PaymentHistoryScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEmployee } = useEmployees();

  const employee = getEmployee(id || '');
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);

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

  const toggleExpand = (paymentId: string) => {
    setExpandedPayment((prev) => (prev === paymentId ? null : paymentId));
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 32 }}>
      <PageHeader title="Histórico de Pagamentos" subtitle={employee.name} showBack />

      <div style={{ padding: 16, maxWidth: 512, margin: '0 auto' }}>
        {employee.paymentHistory.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {employee.paymentHistory.map((payment) => {
              const isExpanded = expandedPayment === payment.id;

              return (
                <div key={payment.id} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <button
                    onClick={() => toggleExpand(payment.id)}
                    className="tap-highlight-none"
                    style={{ width: '100%', padding: 16, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', margin: 0 }}>{formatDateTime(payment.date)}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                          <MoneyDisplay value={payment.amountPaid} size="lg" variant="positive" />
                          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>pago</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0 }}>Vale descontado</p>
                          <MoneyDisplay value={-payment.voucherTotal} size="sm" variant="negative" />
                        </div>
                        {isExpanded ? <ChevronUp style={{ width: 20, height: 20, color: 'var(--color-text-secondary)' }} /> : <ChevronDown style={{ width: 20, height: 20, color: 'var(--color-text-secondary)' }} />}
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="animate-slide-down" style={{ padding: '12px 16px 16px', borderTop: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                        <div style={{ padding: 8, background: 'rgba(39, 44, 54, 0.5)', borderRadius: 8 }}>
                          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0 }}>Salário Base</p>
                          <MoneyDisplay value={payment.baseSalary} size="sm" />
                        </div>
                        <div style={{ padding: 8, background: 'rgba(217, 54, 54, 0.1)', borderRadius: 8 }}>
                          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0 }}>Desconto Vale</p>
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
                            {payment.voucherItems.map((item) => (
                              <VoucherItemCard key={item.id} item={item} showControls={false} bgColor="rgba(39, 44, 54, 0.3)" />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <History style={{ width: 48, height: 48, color: 'var(--color-text-secondary)', margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--color-text-secondary)' }}>Nenhum pagamento registrado</p>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>O histórico aparecerá aqui após o primeiro pagamento</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryScreen;
