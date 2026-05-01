import { PageHeader } from "@/components/PageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ContratoFuncionario,
  FuncionarioPostRequestBody,
} from "@/types/funcionario.type";
import { AlertCircle, ClipboardSignature, SignatureIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CloudinaryService } from "@/services/clodinary.service";
import { useEmployee } from "@/hooks/useEmployee";
import { toast } from "sonner";
import { getFirstAndSecondName } from "@/utils/format";

const NewEmployeeContractScreen = () => {
  const location = useLocation();
  const employeeBody = location.state as FuncionarioPostRequestBody;
  const navigate = useNavigate();

  const [formContrato, setFormContrato] = useState<ContratoFuncionario>({
    contratacao_regime_ctl: false,
    descricao_servicos: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formContrato.descricao_servicos.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { registerEmployee } = useEmployee();

  const handleContractWithoutSignature = async () => {
    if (!validate()) {
      return;
    }

    employeeBody.contrato = formContrato;
    if (employeeBody.foto_url) {
      employeeBody.foto_url = await CloudinaryService.sendPicture(
        employeeBody.foto_url,
      );
    }

    await registerEmployee.mutateAsync({ body: employeeBody });
  };

  const handleGoToSignature = () => {
    if (!validate()) {
      return;
    }

    employeeBody.contrato = formContrato;
    navigate(`/contract-signature`, { state: employeeBody });
  };

  useEffect(() => {
    if (registerEmployee.isPending) return;
    if (registerEmployee.isSuccess) {
      toast.success("Funcionário contratado com sucesso!");
      navigate("/", { replace: true });
    }
    if (registerEmployee.isError) {
      toast.error(`Erro ao contratar o funcionário: ${registerEmployee.error}`);
    }
  }, [registerEmployee.isPending]);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 32 }}>
      <PageHeader
        title={`Contrato de ${getFirstAndSecondName(employeeBody.nome)}`}
        subtitle={"Termos do contrato"}
        showBack
      />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <Card className="p-4 glass-card border-border space-y-4">
          {/* Contract description */}
          <div className="space-y-2">
            <Label htmlFor="name">Descrição dos serviços *</Label>
            <Input
              id="name"
              value={formContrato.descricao_servicos}
              onChange={(e) =>
                setFormContrato((prev) => ({
                  ...prev,
                  descricao_servicos: e.target.value,
                }))
              }
              placeholder="Ex: Preparo de comidas, manutenção da cozinha, preparo de pedidos..."
              className={errors.description ? "border-danger" : ""}
            />
            {errors.description && (
              <p className="text-xs text-danger flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Contract Type */}
          <div className="space-y-3">
            <Label>Tipo de Contrato</Label>
            <RadioGroup
              value={formContrato.contratacao_regime_ctl ? "CLT" : "NAO_CLT"}
              onValueChange={(value) => {
                console.info(value);
                setFormContrato((prev) => ({
                  ...prev,
                  contratacao_regime_ctl: value === "CLT",
                }));
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CLT" id="fixo" />
                <Label htmlFor="fixo" className="font-normal cursor-pointer">
                  Regime CLT
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="NAO_CLT" id="diarista" />
                <Label
                  htmlFor="diarista"
                  className="font-normal cursor-pointer"
                >
                  Regime <strong>NÃO</strong> CLT
                </Label>
              </div>
            </RadioGroup>
          </div>
        </Card>

        <Button
          className="w-full h-12 text-base bg-primary hover:bg-primary/90"
          onClick={handleGoToSignature}
        >
          <SignatureIcon className="w-5 h-5 mr-2" />
          Coletar assinatura
        </Button>

        <Button
          className="w-full h-12 text-base"
          variant="outline"
          onClick={handleContractWithoutSignature}
        >
          <ClipboardSignature className="w-5 h-5 mr-2" />
          Contratar sem assinatura
        </Button>
      </div>
    </div>
  );
};

export default NewEmployeeContractScreen;
