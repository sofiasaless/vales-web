import { MoneyDisplay } from '@/components/MoneyDisplay';
import { PageHeader } from '@/components/PageHeader';
import { useListPayments } from '@/hooks/usePayment';
import { FilterData } from '@/services/payment.service';
import { theme } from '@/theme/theme';
import { Vale } from '@/types/vale.type';
import { calculateTotalVauchers } from '@/utils/calculate';
import { formatDateTime } from '@/utils/format';
import { Button, Card, Spin } from 'antd';
import { ChevronDown, ChevronUp, History, Receipt, ClipboardList, FilePen } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const PaymentHistoryScreen = () => {
  const { id } = useParams<{ id: string }>();

  const [filter, setFilter] = useState<FilterData>({
    data_inicio: new Date(new Date().setDate(1)).toISOString(),
    data_fim: new Date().toISOString()
  })

  const { data: payments, isLoading, isPending } = useListPayments(id, filter)

  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);

  const toggleExpand = (paymentId: string) => {
    setExpandedPayment((prev) => (prev === paymentId ? null : paymentId));
  };

  const renderVoucherItem = (item: Vale) => (
    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, background: theme.colors.colorBgElevated }}>
      <div>
        <p style={{ margin: 0, fontWeight: 500 }}>{item.descricao}</p>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
          {item.quantidade}x <MoneyDisplay value={item.preco_unit} size="sm" />
        </p>
      </div>
      <MoneyDisplay value={item.preco_unit * item.quantidade} size="md" />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 32 }}>
      <PageHeader title="Histórico de Pagamentos" showBack />

      <div style={{ padding: 16, maxWidth: 512, margin: '0 auto' }}>
        {(isLoading || isPending)?
        <Spin />
        :
        (payments?.length > 0) ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {payments?.map((payment) => {
              const isExpanded = expandedPayment === payment.id;

              return (
                <Card key={payment.id} className="glass-card" style={{ cursor: 'pointer' }} onClick={() => toggleExpand(payment.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                        {formatDateTime(new Date(payment.data_pagamento))}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <MoneyDisplay value={payment.valor_pago} size="lg" variant="positive" />
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>pago</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>Vale descontado</p>
                        <MoneyDisplay value={-calculateTotalVauchers(payment.vales)} size="sm" variant="negative" />
                      </div>
                      {isExpanded ? <ChevronUp style={{ width: 20, height: 20, color: 'var(--text-secondary)' }} /> : <ChevronDown style={{ width: 20, height: 20, color: 'var(--text-secondary)' }} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                        <div style={{ padding: 8, background: theme.colors.colorPrimaryTransparent, borderRadius: 8 }}>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>Salário/diária atual</p>
                          <MoneyDisplay value={payment.salario_atual} size="sm" />
                        </div>
                        <div style={{ padding: 8, background: 'rgba(239,68,68,0.1)', borderRadius: 8 }}>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>Desconto Vale</p>
                          <MoneyDisplay value={-calculateTotalVauchers(payment.vales)} size="sm" variant="negative" />
                        </div>
                      </div>

                      {payment.vales.length > 0 && (
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Receipt style={{ width: 16, height: 16 }} />
                            Itens do Vale
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {payment.vales.map(renderVoucherItem)}
                          </div>
                        </div>
                      )}
                    </div>

                  )}
                  <div style={{display: 'flex', gap: 10, flexDirection: 'column'}} className='py-3'>
                    <Button icon={<FilePen size={18}/>} disabled={!payment.assinatura} type='primary' block>Ver relatório assinado</Button>
                    <Button icon={<ClipboardList size={18}/>} block>Gerar relatório</Button>
                  </div>
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
