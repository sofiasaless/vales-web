import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '@/context/EmployeeContext';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Employee, EmployeeType } from '@/types';
import { toast } from 'sonner';
import { validateCPF, formatCPF, parseCurrencyInput } from '@/utils/format';
import { UserPlus, AlertCircle } from 'lucide-react';

const NewEmployeeScreen = () => {
  const navigate = useNavigate();
  const { dispatch } = useEmployees();

  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    baseSalary: '',
    type: 'FIXO' as EmployeeType,
    cpf: '',
    admissionDate: '',
    payday: '5',
    role: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleCPFChange = (value: string) => {
    // Remove non-digits and format
    const digits = value.replace(/\D/g, '').slice(0, 11);
    let formatted = digits;
    if (digits.length > 9) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
    } else if (digits.length > 6) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    } else if (digits.length > 3) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }
    handleInputChange('cpf', formatted);
  };

  const handleSalaryChange = (value: string) => {
    // Allow only digits and comma
    const cleaned = value.replace(/[^\d,]/g, '');
    handleInputChange('baseSalary', cleaned);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Cargo é obrigatório';
    }

    if (!formData.baseSalary) {
      newErrors.baseSalary = 'Salário é obrigatório';
    } else if (parseCurrencyInput(formData.baseSalary) <= 0) {
      newErrors.baseSalary = 'Salário deve ser maior que zero';
    }

    if (formData.cpf && !validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      toast.error('Corrija os erros no formulário');
      return;
    }

    const newEmployee: Employee = {
      id: `emp-${Date.now()}`,
      name: formData.name.trim(),
      birthDate: formData.birthDate ? new Date(formData.birthDate) : new Date(),
      baseSalary: parseCurrencyInput(formData.baseSalary),
      type: formData.type,
      cpf: formData.cpf,
      admissionDate: formData.admissionDate
        ? new Date(formData.admissionDate)
        : new Date(),
      payday: parseInt(formData.payday),
      role: formData.role.trim(),
      currentVoucher: [],
      paymentHistory: [],
    };

    dispatch({ type: 'ADD_EMPLOYEE', payload: newEmployee });
    toast.success('Funcionário cadastrado com sucesso!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Novo Funcionário" subtitle="Preencha os dados" />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <Card className="p-4 glass-card border-border space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Maria Silva"
              className={errors.name ? 'border-danger' : ''}
            />
            {errors.name && (
              <p className="text-xs text-danger flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Cargo *</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              placeholder="Ex: Cozinheira"
              className={errors.role ? 'border-danger' : ''}
            />
            {errors.role && (
              <p className="text-xs text-danger flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.role}
              </p>
            )}
          </div>

          {/* Employee Type */}
          <div className="space-y-3">
            <Label>Tipo de Contrato</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="FIXO" id="fixo" />
                <Label htmlFor="fixo" className="font-normal cursor-pointer">
                  Fixo (Quinzenas)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="DIARISTA" id="diarista" />
                <Label htmlFor="diarista" className="font-normal cursor-pointer">
                  Diarista
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Salary */}
          <div className="space-y-2">
            <Label htmlFor="salary">
              {formData.type === 'DIARISTA' ? 'Valor Diária' : 'Salário Base'} *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                R$
              </span>
              <Input
                id="salary"
                value={formData.baseSalary}
                onChange={(e) => handleSalaryChange(e.target.value)}
                placeholder="0,00"
                className={`pl-10 ${errors.baseSalary ? 'border-danger' : ''}`}
                inputMode="decimal"
              />
            </div>
            {errors.baseSalary && (
              <p className="text-xs text-danger flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.baseSalary}
              </p>
            )}
          </div>

          {/* CPF */}
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={formData.cpf}
              onChange={(e) => handleCPFChange(e.target.value)}
              placeholder="000.000.000-00"
              className={errors.cpf ? 'border-danger' : ''}
              inputMode="numeric"
            />
            {errors.cpf && (
              <p className="text-xs text-danger flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.cpf}
              </p>
            )}
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
            />
          </div>

          {/* Admission Date */}
          <div className="space-y-2">
            <Label htmlFor="admissionDate">Data de Admissão</Label>
            <Input
              id="admissionDate"
              type="date"
              value={formData.admissionDate}
              onChange={(e) => handleInputChange('admissionDate', e.target.value)}
            />
          </div>

          {/* Payday */}
          <div className="space-y-2">
            <Label htmlFor="payday">Dia do Pagamento</Label>
            <select
              id="payday"
              value={formData.payday}
              onChange={(e) => handleInputChange('payday', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {[5, 10, 15, 20, 25, 30].map((day) => (
                <option key={day} value={day}>
                  Todo dia {day.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
        </Card>

        <Button
          className="w-full h-12 text-base bg-primary hover:bg-primary/90"
          onClick={handleSubmit}
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Cadastrar Funcionário
        </Button>
      </div>
    </div>
  );
};

export default NewEmployeeScreen;
