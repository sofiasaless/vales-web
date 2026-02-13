import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { Button, Input, Modal, App } from 'antd';
import { useIncentive } from '@/context/IncentiveContext';
import { Trophy, Plus, Calendar, Target, Crown, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const IncentiveHistoryScreen = () => {
  const navigate = useNavigate();
  const { state, addIncentive } = useIncentive();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ descricao: '', valor_incentivo: '', meta: '', data_expiracao: '' });
  const { message } = App.useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao || !formData.valor_incentivo || !formData.meta || !formData.data_expiracao) { message.error('Preencha todos os campos'); return; }
    addIncentive({ descricao: formData.descricao, valor_incentivo: parseFloat(formData.valor_incentivo), meta: parseInt(formData.meta), data_expiracao: new Date(formData.data_expiracao) });
    message.success('Incentivo criado com sucesso!');
    setFormData({ descricao: '', valor_incentivo: '', meta: '', data_expiracao: '' });
    setIsDialogOpen(false);
  };

  const activeIncentive = state.incentivos.find(i => i.status && !i.ganhador_id);
  const historyIncentives = state.incentivos.filter(i => !i.status || i.ganhador_id);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <PageHeader title="Incentivos" subtitle="Motive sua equipe" showBack />

      <div style={{ padding: 16, maxWidth: 512, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {activeIncentive && (
          <div className="glass-card" style={{ border: '1px solid rgba(45,184,164,0.3)', background: 'rgba(45,184,164,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)', marginBottom: 8 }}><Trophy style={{ width: 20, height: 20 }} /><span style={{ fontWeight: 600 }}>Incentivo Ativo</span></div>
            <p style={{ fontWeight: 500, margin: 0 }}>{activeIncentive.descricao}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <MoneyDisplay value={activeIncentive.valor_incentivo} size="lg" variant="positive" />
              <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Meta: {activeIncentive.meta} vendas</span>
            </div>
          </div>
        )}

        <Button type="primary" block size="large" icon={<Plus style={{ width: 20, height: 20 }} />} disabled={!!activeIncentive} onClick={() => setIsDialogOpen(true)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Começar Novo Incentivo
        </Button>

        {activeIncentive && <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', textAlign: 'center' }}>Finalize o incentivo ativo para criar um novo</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
            <Clock style={{ width: 20, height: 20, color: 'var(--color-text-secondary)' }} /> Histórico de Incentivos
          </h2>

          {historyIncentives.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: 32 }}>
              <Trophy style={{ width: 48, height: 48, color: 'var(--color-text-secondary)', margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--color-text-secondary)' }}>Nenhum incentivo registrado</p>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Crie seu primeiro incentivo para motivar a equipe</p>
            </div>
          ) : historyIncentives.map((inc) => (
            <div key={inc.id} className="glass-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500, margin: 0 }}>{inc.descricao}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, fontSize: 14, color: 'var(--color-text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Target style={{ width: 16, height: 16 }} />Meta: {inc.meta}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar style={{ width: 16, height: 16 }} />{format(new Date(inc.data_expiracao), "dd/MM/yy", { locale: ptBR })}</span>
                  </div>
                </div>
                <MoneyDisplay value={inc.valor_incentivo} size="md" variant="positive" />
              </div>
              {inc.ganhador_nome ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: 8, borderRadius: 8, background: 'rgba(45,184,106,0.1)', border: '1px solid rgba(45,184,106,0.2)' }}>
                  <Crown style={{ width: 16, height: 16, color: 'var(--color-success)' }} />
                  <span style={{ fontSize: 14, color: 'var(--color-success)', fontWeight: 500 }}>Ganhador: {inc.ganhador_nome}</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: 8, borderRadius: 8, background: 'var(--color-bg-muted)' }}>
                  <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Expirado sem ganhador</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Modal open={isDialogOpen} onCancel={() => setIsDialogOpen(false)} title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Trophy style={{ width: 20, height: 20, color: 'var(--color-primary)' }} />Novo Incentivo</span>} footer={null}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
          <div><label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Descrição</label><Input.TextArea placeholder="Ex: Vender 30 sobremesas do dia" value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} /></div>
          <div><label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Valor do Prêmio (R$)</label><Input type="number" step="0.01" placeholder="150.00" value={formData.valor_incentivo} onChange={(e) => setFormData({ ...formData, valor_incentivo: e.target.value })} /></div>
          <div><label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Meta (quantidade de vendas)</label><Input type="number" placeholder="20" value={formData.meta} onChange={(e) => setFormData({ ...formData, meta: e.target.value })} /></div>
          <div><label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Data de Expiração</label><Input type="date" value={formData.data_expiracao} onChange={(e) => setFormData({ ...formData, data_expiracao: e.target.value })} /></div>
          <Button type="primary" htmlType="submit" block>Criar Incentivo</Button>
        </form>
      </Modal>
    </div>
  );
};

export default IncentiveHistoryScreen;
