import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '@/context/EmployeeContext';
import { PageHeader } from '@/components/PageHeader';
import { Button, Input, Radio, Select, App } from 'antd';
import { Employee, EmployeeType } from '@/types';
import { validateCPF, formatCPF, parseCurrencyInput } from '@/utils/format';
import { UserPlus, AlertCircle } from 'lucide-react';

const NewEmployeeScreen = () => {
  const navigate = useNavigate();
  const { dispatch } = useEmployees();
  const { message } = App.useApp();

  const [formData, setFormData] = useState({
    name: '', birthDate: '', baseSalary: '', type: 'FIXO' as EmployeeType,
    cpf: '', admissionDate: '', payday: '5', role: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleCPFChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    let formatted = digits;
    if (digits.length > 9) formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
    else if (digits.length > 6) formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    else if (digits.length > 3) formatted = `${digits.slice(0, 3)}.${digits.slice(3)}`;
    handleInputChange('cpf', formatted);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.role.trim()) newErrors.role = 'Cargo é obrigatório';
    if (!formData.baseSalary) newErrors.baseSalary = 'Salário é obrigatório';
    else if (parseCurrencyInput(formData.baseSalary) <= 0) newErrors.baseSalary = 'Salário deve ser maior que zero';
    if (formData.cpf && !validateCPF(formData.cpf)) newErrors.cpf = 'CPF inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) { message.error('Corrija os erros no formulário'); return; }
    const newEmployee: Employee = {
      id: `emp-${Date.now()}`, name: formData.name.trim(),
      birthDate: formData.birthDate ? new Date(formData.birthDate) : new Date(),
      baseSalary: parseCurrencyInput(formData.baseSalary), type: formData.type, cpf: formData.cpf,
      admissionDate: formData.admissionDate ? new Date(formData.admissionDate) : new Date(),
      payday: parseInt(formData.payday), role: formData.role.trim(), currentVoucher: [], paymentHistory: [],
    };
    dispatch({ type: 'ADD_EMPLOYEE', payload: newEmployee });
    message.success('Funcionário cadastrado com sucesso!');
    navigate('/');
  };

  const fieldStyle = { marginBottom: 16 };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 6, color: 'var(--color-text)' };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <PageHeader title="Novo Funcionário" subtitle="Preencha os dados" />

      <div style={{ padding: 16, maxWidth: 512, margin: '0 auto' }}>
        <div className="glass-card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Nome Completo *</label>
            <Input value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Ex: Maria Silva" status={errors.name ? 'error' : undefined} />
            {errors.name && <p style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle style={{ width: 12, height: 12 }} />{errors.name}</p>}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Cargo *</label>
            <Input value={formData.role} onChange={(e) => handleInputChange('role', e.target.value)} placeholder="Ex: Cozinheira" status={errors.role ? 'error' : undefined} />
            {errors.role && <p style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle style={{ width: 12, height: 12 }} />{errors.role}</p>}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Tipo de Contrato</label>
            <Radio.Group value={formData.type} onChange={(e) => handleInputChange('type', e.target.value)} style={{ display: 'flex', gap: 16 }}>
              <Radio value="FIXO">Fixo (Quinzenas)</Radio>
              <Radio value="DIARISTA">Diarista</Radio>
            </Radio.Group>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>{formData.type === 'DIARISTA' ? 'Valor Diária' : 'Salário Base'} *</label>
            <Input prefix="R$" value={formData.baseSalary} onChange={(e) => handleInputChange('baseSalary', e.target.value.replace(/[^\d,]/g, ''))} placeholder="0,00" status={errors.baseSalary ? 'error' : undefined} inputMode="decimal" />
            {errors.baseSalary && <p style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle style={{ width: 12, height: 12 }} />{errors.baseSalary}</p>}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>CPF</label>
            <Input value={formData.cpf} onChange={(e) => handleCPFChange(e.target.value)} placeholder="000.000.000-00" status={errors.cpf ? 'error' : undefined} inputMode="numeric" />
            {errors.cpf && <p style={{ fontSize: 12, color: 'var(--color-danger)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle style={{ width: 12, height: 12 }} />{errors.cpf}</p>}
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Data de Nascimento</label>
            <Input type="date" value={formData.birthDate} onChange={(e) => handleInputChange('birthDate', e.target.value)} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Data de Admissão</label>
            <Input type="date" value={formData.admissionDate} onChange={(e) => handleInputChange('admissionDate', e.target.value)} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Dia do Pagamento</label>
            <Select value={formData.payday} onChange={(v) => handleInputChange('payday', v)} style={{ width: '100%' }}
              options={[5, 10, 15, 20, 25, 30].map((d) => ({ value: d.toString(), label: `Todo dia ${d.toString().padStart(2, '0')}` }))}
            />
          </div>
        </div>

        <Button type="primary" block size="large" icon={<UserPlus style={{ width: 20, height: 20 }} />} onClick={handleSubmit}
          style={{ height: 48, fontSize: 16, marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Cadastrar Funcionário
        </Button>
      </div>
    </div>
  );
};

export default NewEmployeeScreen;
