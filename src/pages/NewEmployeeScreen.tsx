/* eslint-disable @typescript-eslint/no-explicit-any */
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEmployee } from "@/hooks/useEmployee";
import { CloudinaryService } from "@/services/clodinary.service";
import { FuncionarioPostRequestBody } from "@/types/funcionario.type";
import { onChangeNumberInput, onKeyDownNumberInput, parseCurrencyInput, validateCPF } from "@/utils/format";
import { PlusOutlined } from "@ant-design/icons";
import { Button as ButtonAnt, DatePicker, DatePickerProps, Upload } from "antd";
import { UploadFile } from "antd/lib/upload";
import { AlertCircle, FileSignature, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const emptyEmployee: FuncionarioPostRequestBody = {
  cargo: "",
  nome: "",
  incentivo: [],
  vales: [],
  primeiro_dia_pagamento: 0,
  segundo_dia_pagamento: 0,
  salario: 0,
  cpf: "",
  tipo: "FIXO",
  dias_trabalhados_semanal: 0,
  data_admissao: "",
};

const NewEmployeeScreen = () => {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState<FuncionarioPostRequestBody>(emptyEmployee);

  const [pictureFile, setPictureFile] = useState<UploadFile[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [admissionDate, setAdmissionDate] = useState<Date>(new Date());

  const setAdmission: DatePickerProps['onChange'] = (date, dateString) => {
    const converted = ((date as any).$d as Date)
    setAdmissionDate(converted)
    setFormData((prev) => ({
      ...prev,
      data_admissao: converted.toISOString()
    }))
  };

  const setBirth: DatePickerProps['onChange'] = (date, dateString) => {
    const converted = ((date as any).$d as Date).toISOString()
    setFormData((prev) => ({
      ...prev,
      data_nascimento: converted
    }))
  };

  const calculatePaydays = () => {
    const dateOne = new Date(new Date().setDate(admissionDate.getDate() + 15));
    const dateTwo = new Date(new Date().setDate(dateOne.getDate() + 17));

    const dayOne = dateOne.getDate();
    const dayTwo = dateTwo.getDate();

    setFormData((prev) => ({
      ...prev,
      primeiro_dia_pagamento: dayOne,
      segundo_dia_pagamento: dayTwo,
    }));
    return { dayOne, dayTwo };
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCPFChange = (value: string) => {
    // Remove non-digits and format
    const digits = value.replace(/\D/g, "").slice(0, 11);
    let formatted = digits;
    if (digits.length > 9) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
    } else if (digits.length > 6) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    } else if (digits.length > 3) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3)}`;
    }
    handleInputChange("cpf", formatted);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.cargo.trim()) {
      newErrors.role = "Cargo é obrigatório";
    }

    if (formData.tipo === "DIARISTA") {
      if (
        formData.dias_trabalhados_semanal <= 0 ||
        !formData.dias_trabalhados_semanal
      ) {
        newErrors.diasTrabalhados = "Dias de trabalho deve ser maior que zero";
      }
    }

    if (!formData.salario) {
      newErrors.baseSalary = "Salário é obrigatório";
    } else if (formData.salario <= 0) {
      newErrors.baseSalary = "Salário deve ser maior que zero";
    }

    if (formData.cpf && !validateCPF(formData.cpf)) {
      newErrors.cpf = "CPF inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const prepareForm = async (uploadPicture: boolean = false) => {
    const form = formData;
    if (form.tipo === "DIARISTA") {
      form.primeiro_dia_pagamento = 0;
      form.segundo_dia_pagamento = 0;
    } else {
      form.dias_trabalhados_semanal = null;
      if (
        form.primeiro_dia_pagamento === 0 ||
        form.segundo_dia_pagamento === 0
      ) {
        const days = calculatePaydays();
        form.primeiro_dia_pagamento = days.dayOne;
        form.segundo_dia_pagamento = days.dayTwo;
      }
    }

    if (form.data_admissao === "") {
      form.data_admissao = admissionDate.toISOString();
    }

    // se tiver uma foto anexada então envia para o cloudnary
    if (pictureFile.length > 0 && pictureFile[0].originFileObj) {
      if (uploadPicture) {
        form.foto_url = await CloudinaryService.sendPicture(
          pictureFile[0].originFileObj as File,
        );
      } else {
        form.foto_url = pictureFile[0].thumbUrl;
      }
    }

    // removendo os espaços em branco
    form.nome = form.nome.trim();
    form.cargo = form.cargo.trim();

    return form;
  };

  const { registerEmployee } = useEmployee();

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Corrija os erros no formulário");
      return;
    }

    const toSend = await prepareForm(true);
    await registerEmployee.mutateAsync({ body: toSend });
  };

  const handleGoToContract = async () => {
    if (!validate()) return;
    const stateToSend = await prepareForm();
    navigate(`/contract-employee`, { state: stateToSend });
  };

  useEffect(() => {
    if (registerEmployee.isPending) return;
    if (registerEmployee.isSuccess) {
      setFormData(emptyEmployee);
      setAdmissionDate(new Date());
      setPictureFile([]);

      toast.success("Funcionário cadastrado com sucesso!");
      navigate("/");
    }
    if (registerEmployee.isError) {
      toast.error(`Erro ao cadastrar o funcionário: ${registerEmployee.error}`);
    }
  }, [registerEmployee.isPending]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Novo Funcionário" subtitle="Preencha os dados" />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <Card className="p-4 glass-card border-border space-y-4">
          {/* Upload Picture */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Upload
              listType="picture-circle"
              fileList={pictureFile}
              maxCount={1}
              beforeUpload={() => false}
              onChange={({ fileList }) => {
                setPictureFile(fileList.slice(-1));
              }}
            >
              <button style={{ border: 0, background: "none" }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Imagem de perfil</div>
              </button>
            </Upload>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.nome}
              onChange={(e) => handleInputChange("nome", e.target.value)}
              placeholder="Ex: Maria Silva"
              className={errors.name ? "border-danger" : ""}
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
              value={formData.cargo}
              onChange={(e) => handleInputChange("cargo", e.target.value)}
              placeholder="Ex: Cozinheira"
              className={errors.role ? "border-danger" : ""}
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
              value={formData.tipo}
              onValueChange={(value) => handleInputChange("tipo", value)}
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
                <Label
                  htmlFor="diarista"
                  className="font-normal cursor-pointer"
                >
                  Diarista
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Salary */}
          <div className="space-y-2">
            <Label htmlFor="salary">
              {formData.tipo === "DIARISTA" ? "Valor Diária" : "Salário Base"} *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                R$
              </span>
              <Input
                id="salary"
                value={formData.salario.toFixed(2)}
                onKeyDown={onKeyDownNumberInput}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    salario: onChangeNumberInput(e),
                  }))
                }}
                placeholder="0,00"
                className={`pl-10 ${errors.baseSalary ? "border-danger" : ""}`}
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

          {formData.tipo === "DIARISTA" && (
            <div className="space-y-2">
              <Label htmlFor="daysForWork">Dias de trabalho p/ semana</Label>
              <div className="relative">
                <Input
                  min={1}
                  id="daysForWork"
                  value={formData.dias_trabalhados_semanal.toString() || "0"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dias_trabalhados_semanal: Number(e.target.value),
                    }))
                  }
                  placeholder="0"
                  className={` ${errors.diasTrabalhados ? "border-danger" : ""}`}
                  inputMode="decimal"
                />
              </div>
              {errors.diasTrabalhados && (
                <p className="text-xs text-danger flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.diasTrabalhados}
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
              className={errors.cpf ? "border-danger" : ""}
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
          <div style={{ display: 'flex', flexDirection: 'column' }} className="space-y-2">
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <DatePicker id="birthDate" format={'DD/MM/YYYY'} onChange={setBirth} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }} className="space-y-2">
            <Label htmlFor="admissionDate">Data de Admissão</Label>
            <DatePicker id="admissionDate" format={'DD/MM/YYYY'} onChange={setAdmission} />
          </div>

          {/* Payday */}
          {formData.tipo === "FIXO" && (
            <>
              <div className="flex flex-row gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payday">1° Dia do Pagamento</Label>
                  <Input
                    id="payday"
                    value={formData.primeiro_dia_pagamento.toString()}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        primeiro_dia_pagamento: Number(e.target.value),
                      }));
                    }}
                    className={`${errors.dia_pagamento ? "border-danger" : ""}`}
                    inputMode="decimal"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payday">2° Dia do Pagamento</Label>
                  <Input
                    id="payday"
                    value={formData.segundo_dia_pagamento.toString()}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        segundo_dia_pagamento: Number(e.target.value),
                      }));
                    }}
                    className={`${errors.dia_pagamento ? "border-danger" : ""}`}
                    inputMode="decimal"
                  />
                </div>
              </div>

              <ButtonAnt
                style={{ flex: 1, width: "100%" }}
                variant="dashed"
                color="yellow"
                onClick={calculatePaydays}
              >
                Calcular dias de pagamento
              </ButtonAnt>
            </>
          )}
        </Card>

        <Button
          className="w-full h-12 text-base bg-primary hover:bg-primary/90"
          onClick={handleGoToContract}
        >
          <FileSignature className="w-5 h-5 mr-2" />
          Contratar funcionário
        </Button>

        <Button
          className="w-full h-12 text-base"
          onClick={handleSubmit}
          variant="outline"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Apenas cadastrar funcionário
        </Button>
      </div>
    </div>
  );
};

export default NewEmployeeScreen;
