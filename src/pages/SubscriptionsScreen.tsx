import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { Button, Modal, App } from 'antd';
import { Calendar, Copy, Check, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Subscription {
  id: string; name: string; amount: number; dueDate: Date; status: 'pending' | 'paid' | 'overdue'; pixKey: string;
}

const mockSubscriptions: Subscription[] = [
  { id: 'sub-1', name: 'Mensalidade - Janeiro 2024', amount: 99.90, dueDate: new Date('2024-01-15'), status: 'paid', pixKey: 'pix@valerestaurante.com.br' },
  { id: 'sub-2', name: 'Mensalidade - Fevereiro 2024', amount: 99.90, dueDate: new Date('2024-02-15'), status: 'pending', pixKey: 'pix@valerestaurante.com.br' },
  { id: 'sub-3', name: 'Mensalidade - Março 2024', amount: 99.90, dueDate: new Date('2024-03-15'), status: 'overdue', pixKey: 'pix@valerestaurante.com.br' },
];

const SubscriptionsScreen = () => {
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [copied, setCopied] = useState(false);
  const { message } = App.useApp();

  const getStatusConfig = (status: Subscription['status']) => {
    switch (status) {
      case 'paid': return { label: 'Pago', bg: 'rgba(45,184,106,0.1)', color: '#2db86a', icon: CheckCircle2 };
      case 'pending': return { label: 'Pendente', bg: 'rgba(242,166,13,0.1)', color: '#f2a60d', icon: Clock };
      case 'overdue': return { label: 'Vencido', bg: 'rgba(217,54,54,0.1)', color: '#d93636', icon: AlertCircle };
    }
  };

  const handleCopyPixKey = async (pixKey: string) => {
    try { await navigator.clipboard.writeText(pixKey); setCopied(true); message.success('Chave PIX copiada!'); setTimeout(() => setCopied(false), 2000); }
    catch { message.error('Erro ao copiar chave PIX'); }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <PageHeader title="Mensalidades" showBack />

      <div style={{ padding: 16, maxWidth: 512, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {mockSubscriptions.map((sub) => {
          const sc = getStatusConfig(sub.status);
          const StatusIcon = sc.icon;
          return (
            <div key={sub.id} className="glass-card card-interactive tap-highlight-none" onClick={() => setSelectedSubscription(sub)} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 600, margin: 0 }}>{sub.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                    <Calendar style={{ width: 16, height: 16 }} />
                    <span>Vencimento: {format(sub.dueDate, "dd 'de' MMMM", { locale: ptBR })}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <MoneyDisplay value={sub.amount} size="md" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 500, background: sc.bg, color: sc.color }}>
                    <StatusIcon style={{ width: 12, height: 12 }} />{sc.label}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={!!selectedSubscription} onCancel={() => { setSelectedSubscription(null); setCopied(false); }} title={selectedSubscription?.name} footer={[
        <Button key="close" block onClick={() => { setSelectedSubscription(null); setCopied(false); }}>Fechar</Button>,
      ]}>
        {selectedSubscription && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
            <div style={{ padding: 16, borderRadius: 8, background: 'rgba(39,44,54,0.5)', textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 4 }}>Valor</p>
              <MoneyDisplay value={selectedSubscription.amount} size="lg" />
            </div>
            <div style={{ padding: 16, borderRadius: 8, background: 'rgba(39,44,54,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                <Calendar style={{ width: 16, height: 16 }} /><span style={{ fontSize: 14 }}>Data de Vencimento</span>
              </div>
              <p style={{ fontWeight: 600, margin: 0 }}>{format(selectedSubscription.dueDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
            </div>
            {(() => { const sc = getStatusConfig(selectedSubscription.status); const SI = sc.icon; return (
              <div style={{ padding: 16, borderRadius: 8, background: sc.bg, display: 'flex', alignItems: 'center', gap: 8 }}>
                <SI style={{ width: 20, height: 20, color: sc.color }} /><span style={{ fontWeight: 600, color: sc.color }}>Status: {sc.label}</span>
              </div>
            ); })()}
            <div>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Chave PIX para pagamento:</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, padding: 12, borderRadius: 8, background: 'rgba(39,44,54,0.5)', border: '1px solid var(--color-border)', fontFamily: 'monospace', fontSize: 14, wordBreak: 'break-all' }}>{selectedSubscription.pixKey}</div>
                <Button icon={copied ? <Check style={{ width: 16, height: 16, color: 'var(--color-success)' }} /> : <Copy style={{ width: 16, height: 16 }} />} onClick={() => handleCopyPixKey(selectedSubscription.pixKey)} />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubscriptionsScreen;
