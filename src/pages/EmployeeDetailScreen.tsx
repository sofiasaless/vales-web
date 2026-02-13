import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '@/context/EmployeeContext';
import { PageHeader } from '@/components/PageHeader';
import { AvatarInitials } from '@/components/AvatarInitials';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { Button, Modal, App } from 'antd';
import { formatDate, formatCPF, getPaydayText } from '@/utils/format';
import { User, Calendar, Wallet, Briefcase, CreditCard, Trash2, Edit, AlertCircle } from 'lucide-react';

const EmployeeDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEmployee, dispatch } = useEmployees();
  const { message, modal } = App.useApp();

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

  const handleDelete = () => {
    modal.confirm({
      title: 'Excluir Funcionário',
      content: `Tem certeza que deseja excluir ${employee.name}? Esta ação não pode ser desfeita.`,
      okText: 'Excluir',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: () => {
        dispatch({ type: 'DELETE_EMPLOYEE', payload: employee.id });
        message.success('Funcionário excluído');
        navigate('/');
      },
    });
  };

  const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | React.ReactNode }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ padding: 8, borderRadius: 8, background: 'var(--color-bg-secondary)' }}>
        <Icon style={{ width: 16, height: 16, color: 'var(--color-text-secondary)' }} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: 0 }}>{label}</p>
        <p style={{ fontWeight: 500, margin: 0 }}>{value}</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 32 }}>
      <PageHeader title="Detalhes" subtitle={employee.name} showBack />

      <div style={{ padding: 16, maxWidth: 512, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Header */}
        <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
          <AvatarInitials name={employee.name} size="lg" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{employee.name}</h2>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>{employee.role}</p>
          <span style={{
            display: 'inline-block', marginTop: 8, padding: '4px 12px', borderRadius: 12,
            background: 'rgba(45, 184, 164, 0.1)', color: 'var(--color-primary)', fontSize: 14,
          }}>
            {employee.type === 'DIARISTA' ? 'Diarista' : 'Fixo (Quinzenas)'}
          </span>
        </div>

        {/* Personal Info */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', background: 'rgba(39, 44, 54, 0.5)' }}>
            <h3 style={{ fontWeight: 600, margin: 0 }}>Informações Pessoais</h3>
          </div>
          <div style={{ padding: '0 16px' }}>
            {employee.cpf && <InfoRow icon={User} label="CPF" value={formatCPF(employee.cpf)} />}
            {employee.birthDate && <InfoRow icon={Calendar} label="Data de Nascimento" value={formatDate(employee.birthDate)} />}
          </div>
        </div>

        {/* Employment */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', background: 'rgba(39, 44, 54, 0.5)' }}>
            <h3 style={{ fontWeight: 600, margin: 0 }}>Dados Funcionais</h3>
          </div>
          <div style={{ padding: '0 16px' }}>
            <InfoRow icon={Briefcase} label="Cargo" value={employee.role} />
            <InfoRow icon={Wallet} label={employee.type === 'DIARISTA' ? 'Valor Diária' : 'Salário Base'} value={<MoneyDisplay value={employee.baseSalary} size="md" />} />
            <InfoRow icon={Calendar} label="Data de Admissão" value={formatDate(employee.admissionDate)} />
            <InfoRow icon={CreditCard} label="Dia do Pagamento" value={getPaydayText(employee.payday)} />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, paddingTop: 16 }}>
          <Button block size="large" icon={<Edit style={{ width: 16, height: 16 }} />} disabled style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            Editar
          </Button>
          <Button block size="large" danger icon={<Trash2 style={{ width: 16, height: 16 }} />} onClick={handleDelete} style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailScreen;
