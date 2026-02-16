import { MoneyDisplay } from '@/components/MoneyDisplay';
import { PageHeader } from '@/components/PageHeader';
import { usePayment } from '@/hooks/usePayment';
import { theme } from '@/theme/theme';
import { FuncionarioResponseBody } from '@/types/funcionario.type';
import { PagamentoPostRequestBody } from '@/types/pagamento.type';
import { Vale } from '@/types/vale.type';
import { calcularBaseSalary, calculateAmount, calculateTotalVauchers } from '@/utils/calculate';
import { Button, Card, Modal, Typography } from 'antd';
import { AlertCircle, Banknote, CheckCircle, Receipt, Wallet, FileSignature } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const { Text } = Typography

const PaymentConfirmationScreen = () => {
  const location = useLocation()
  const employee = location.state as FuncionarioResponseBody
  const navigate = useNavigate();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (!employee) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <AlertCircle style={{ width: 48, height: 48, color: 'var(--danger)' }} />
        <p style={{ fontSize: 18, fontWeight: 500 }}>Erro ao carregar pagamento</p>
        <Button onClick={() => navigate('/')}>Voltar</Button>
      </div>
    );
  }

  const { pay } = usePayment()

  const handleConfirmPayment = async () => {

    const payment: PagamentoPostRequestBody = {
      incentivo: employee.incentivo,
      vales: employee.vales,
      salario_atual: employee.salario,
      valor_pago: calculateAmount(employee)
    };

    await pay.mutateAsync({ employeeId: employee.id, body: payment })
  };

  useEffect(() => {
    if (pay.isPending) return;
    if (pay.isSuccess) {
      setShowConfirmModal(false);
      toast.success('Pagamento confirmado com sucesso!');
      navigate('/', { replace: true });
    }
    if (pay.isError) {
      toast.success(`Erro ao tentar realizar o pagamento: ${pay.error}`);
    }
  }, [pay.isPending])

  const labelSalary = (employee.tipo === 'FIXO') ? 'Valor da quinzena' : 'Total das diárias'
  const labelBaseSalary = (employee.tipo === 'FIXO') ? `Salário base R$ ${employee.salario.toFixed(2)}` : `Diária R$ ${employee.salario.toFixed(2)}`

  const renderVoucherItem = (item: Vale) => (
    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, backgroundColor: theme.colors.colorErrorTransparent }}>
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
      <PageHeader title="Confirmar Pagamento" subtitle={employee?.nome} showBack />

      <div style={{ padding: 16, maxWidth: 512, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ padding: 8, borderRadius: '50%', background: theme.colors.colorPrimaryTransparent }}>
              <Wallet style={{ width: 20, height: 20, color: 'var(--primary)' }} />
            </div>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{labelSalary}</span>
          </div>
          <div className='mb-2'>
            <Text style={{ color: theme.colors.colorTextSecondary }}>{labelBaseSalary}</Text>
          </div>
          <MoneyDisplay value={calcularBaseSalary(employee)} size="xl" />
        </Card>

        <Card className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ padding: 8, borderRadius: '50%', background: 'rgba(239,68,68,0.2)' }}>
              <Receipt style={{ width: 20, height: 20, color: 'var(--danger)' }} />
            </div>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Total do Vale a Descontar</span>
          </div>
          <MoneyDisplay value={-calculateTotalVauchers(employee.vales)} size="xl" variant="negative" />

          {employee?.vales.length > 0 && (
            <div style={{ maxHeight: 200, overflowY: 'auto', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {employee?.vales.map(renderVoucherItem)}
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
          <MoneyDisplay value={calculateAmount(employee)} size="xl" variant={calculateAmount(employee) < 0 ? 'negative' : 'positive'} />
        </Card>

        <div style={{ gap: 5, display: 'flex', flexDirection: 'column' }}>
          <Button
            type="primary"
            block
            size="large"
            icon={<FileSignature style={{ width: 20, height: 20 }} />}
            // onClick={() => setShowConfirmModal(true)}
            style={{ height: 56, fontSize: 16, marginTop: 8 }}
          >
            Ir para assinatura
          </Button>

          <Button
            block
            variant='outlined'
            size="large"
            icon={<CheckCircle style={{ width: 20, height: 20 }} />}
            onClick={() => setShowConfirmModal(true)}
            style={{ height: 56, fontSize: 16, marginTop: 8 }}
          >
            Pagar sem assinatura
          </Button>
        </div>
      </div>

      <Modal
        title="Confirmar Pagamento"
        open={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onOk={handleConfirmPayment}
        confirmLoading={pay.isPending}
        okText="Confirmar"
        cancelText="Cancelar"
      >
        <p style={{ color: 'var(--text-secondary)' }}>
          Você está prestes a confirmar o pagamento de <strong>{employee?.nome}</strong>.
        </p>
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>Valor a ser pago:</p>
          <MoneyDisplay value={calculateAmount(employee)} size="xl" variant={calculateAmount(employee) < 0 ? 'negative' : 'positive'} />
        </div>
        <div style={{ padding: 12, background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: 8, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--warning)', margin: 0 }}>
            ⚠️ Os vales e incentivos serão zerados após a confirmação
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentConfirmationScreen;
