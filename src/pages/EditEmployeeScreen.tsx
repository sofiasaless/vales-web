import { PlusOutlined } from "@ant-design/icons";
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEmployee, useFindEmployee } from '@/hooks/useEmployee';
import { FuncionarioUpdateRequestBody } from '@/types/funcionario.type';
import { parseCurrencyInput, validateCPF } from '@/utils/format';
import { Button as ButtonAnt, DatePicker, DatePickerProps, Spin, Upload } from 'antd';
import { AlertCircle, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { UploadFile } from "antd/lib/upload";
import { CloudinaryService } from '@/services/clodinary.service';
import dayjs from 'dayjs';

const EditEmployeeScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: employee, isLoading } = useFindEmployee(id);
  const { updateEmployee } = useEmployee();

  const [formData, setFormData] = useState<FuncionarioUpdateRequestBody | null>(null);
  const [inputSalario, setInputSalario] = useState('');
  const [pictureFile, setPictureFile] = useState<UploadFile[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialized, setInitialized] = useState(false);

  // Initialize form with employee data
  useEffect(() => {
    if (employee && !initialized) {
      setFormData({
        nome: employee.nome,
        cargo: employee.cargo,
        cpf: employee.cpf || '',
        data_admissao: employee.data_admissao,
        data_nascimento: employee.data_nascimento || null,
        primeiro_dia_pagamento: employee.primeiro_dia_pagamento,
        segundo_dia_pagamento: employee.segundo_dia_pagamento,
        tipo: employee.tipo,
        salario: employee.salario,
        foto_url: employee.foto_url || '',
        dias_trabalhados_semanal: employee.dias_trabalhados_semanal || 0,
      });
      setInputSalario(employee.salario.toString().replace('.', ','));
      if (employee.foto_url) {
        setPictureFile([{
          uid: '-1',
          name: 'foto',
          status: 'done',
          url: employee.foto_url,
        }]);
      }
      setInitialized(true);
    }
  }, [employee, initialized]);

  if (isLoading || !formData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => prev ? { ...prev, [field]: value } : prev);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleCPFChange = (value: string) => {
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
    setInputSalario(value);
    const cleaned = value.replace(/[^\d,]/g, '');
    handleInputChange('salario', cleaned);
  };

  const setAdmission: DatePickerProps['onChange'] = (date) => {
    if (!date) return;
    const converted = ((date as any).$d as Date).toISOString();
    handleInputChange('data_admissao', converted);
  };

  const setBirth: DatePickerProps['onChange'] = (date) => {
    if (!date) return;
    const converted = ((date as any).$d as Date).toISOString();
    handleInputChange('data_nascimento', converted);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.cargo.trim()) newErrors.role = 'Cargo é obrigatório';

    if (formData.tipo === 'DIARISTA') {
      if (!formData.dias_trabalhados_semanal || formData.dias_trabalhados_semanal <= 0) {
        newErrors.diasTrabalhados = 'Dias de trabalho deve ser maior que zero';
      }
    }

    if (!inputSalario || parseCurrencyInput(inputSalario) <= 0) {
      newErrors.baseSalary = 'Salário deve ser maior que zero';
    }

    if (formData.cpf && !validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('Corrija os erros no formulário');
      return;
    }

    const toSend = { ...formData };
    toSend.nome = toSend.nome.trim();
    toSend.cargo = toSend.cargo.trim();
    toSend.salario = parseCurrencyInput(inputSalario);

    if (toSend.tipo === 'DIARISTA') {
      toSend.primeiro_dia_pagamento = 0;
      toSend.segundo_dia_pagamento = 0;
    } else {
      toSend.dias_trabalhados_semanal = null;
    }

    // Handle photo upload
    if (pictureFile.length > 0 && pictureFile[0].originFileObj) {
      toSend.foto_url = await CloudinaryService.sendPicture(pictureFile[0].originFileObj as File);
    } else if (pictureFile.length === 0) {
      toSend.foto_url = '';
    }

    await updateEmployee.mutateAsync({ employeeId: id!, body: toSend });
  };

  useEffect(() => {
    if (updateEmployee.isPending) return;
    if (updateEmployee.isSuccess) {
      toast.success('Funcionário atualizado com sucesso!');
      navigate(`/employee/${id}/details`, { replace: true });
    }
    if (updateEmployee.isError) {
      toast.error(`Erro ao atualizar: ${updateEmployee.error}`);
    }
  }, [updateEmployee.isPending]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Editar Funcionário" subtitle={employee?.nome} showBack />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <Card className="p-4 glass-card border-border space-y-4">
          {/* Upload Picture */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Upload
              listType="picture-circle"
              fileList={pictureFile}
              maxCount={1}
              beforeUpload={() => false}
              onChange={({ fileList }) => setPictureFile(fileList.slice(-1))}
            >
              <button style={{ border: 0, background: 'none' }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Foto</div>
              </button>
            </Upload>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Ex: Maria Silva"
              className={errors.name ? 'border-danger' : ''}
            />
            {errors.name && (
              <p className="text-xs text-danger flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Cargo *</Label>
            <Input
              id="role"
              value={formData.cargo}
              onChange={(e) => handleInputChange('cargo', e.target.value)}
              placeholder="Ex: Cozinheira"
              className={errors.role ? 'border-danger' : ''}
            />
            {errors.role && (
              <p className="text-xs text-danger flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.role}
              </p>
            )}
          </div>

          {/* Employee Type */}
          <div className="space-y-3">
            <Label>Tipo de Contrato</Label>
            <RadioGroup
              value={formData.tipo}
              onValueChange={(value) => handleInputChange('tipo', value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="FIXO" id="fixo" />
                <Label htmlFor="fixo" className="font-normal cursor-pointer">Fixo (Quinzenas)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="DIARISTA" id="diarista" />
                <Label htmlFor="diarista" className="font-normal cursor-pointer">Diarista</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Salary */}
          <div className="space-y-2">
            <Label htmlFor="salary">
              {formData.tipo === 'DIARISTA' ? 'Valor Diária' : 'Salário Base'} *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
              <Input
                id="salary"
                value={inputSalario}
                onChange={(e) => handleSalaryChange(e.target.value)}
                placeholder="0,00"
                className={`pl-10 ${errors.baseSalary ? 'border-danger' : ''}`}
                inputMode="decimal"
              />
            </div>
            {errors.baseSalary && (
              <p className="text-xs text-danger flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.baseSalary}
              </p>
            )}
          </div>

          {formData.tipo === 'DIARISTA' && (
            <div className="space-y-2">
              <Label htmlFor="daysForWork">Dias de trabalho p/ semana</Label>
              <Input
                type="number"
                min={1}
                id="daysForWork"
                value={formData.dias_trabalhados_semanal?.toString() || '0'}
                onChange={(e) => handleInputChange('dias_trabalhados_semanal', Number(e.target.value))}
                placeholder="0"
                className={errors.diasTrabalhados ? 'border-danger' : ''}
                inputMode="decimal"
              />
              {errors.diasTrabalhados && (
                <p className="text-xs text-danger flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.diasTrabalhados}
                </p>
              )}
            </div>
          )}

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
                <AlertCircle className="w-3 h-3" /> {errors.cpf}
              </p>
            )}
          </div>

          {/* Birth Date */}
          <div style={{ display: 'flex', flexDirection: 'column' }} className="space-y-2">
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <DatePicker
              id="birthDate"
              format="DD/MM/YYYY"
              onChange={setBirth}
              value={formData.data_nascimento ? dayjs(formData.data_nascimento) : undefined}
            />
          </div>

          {/* Admission Date */}
          <div style={{ display: 'flex', flexDirection: 'column' }} className="space-y-2">
            <Label htmlFor="admissionDate">Data de Admissão</Label>
            <DatePicker
              id="admissionDate"
              format="DD/MM/YYYY"
              onChange={setAdmission}
              value={formData.data_admissao ? dayjs(formData.data_admissao) : undefined}
            />
          </div>

          {/* Payday */}
          {formData.tipo === 'FIXO' && (
            <div className="flex flex-row gap-4">
              <div className="space-y-2">
                <Label htmlFor="payday1">1° Dia do Pagamento</Label>
                <Input
                  id="payday1"
                  value={formData.primeiro_dia_pagamento.toString()}
                  onChange={(e) => handleInputChange('primeiro_dia_pagamento', Number(e.target.value))}
                  inputMode="decimal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payday2">2° Dia do Pagamento</Label>
                <Input
                  id="payday2"
                  value={formData.segundo_dia_pagamento.toString()}
                  onChange={(e) => handleInputChange('segundo_dia_pagamento', Number(e.target.value))}
                  inputMode="decimal"
                />
              </div>
            </div>
          )}
        </Card>

        <Button
          className="w-full h-12 text-base bg-primary hover:bg-primary/90"
          onClick={handleSubmit}
          disabled={updateEmployee.isPending}
        >
          <Save className="w-5 h-5 mr-2" />
          {updateEmployee.isPending ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  );
};

export default EditEmployeeScreen;
