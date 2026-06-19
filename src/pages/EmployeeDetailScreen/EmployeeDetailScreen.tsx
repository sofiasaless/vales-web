/* eslint-disable @typescript-eslint/no-explicit-any */
import { AvatarInitials } from "@/components/AvatarInitials/AvatarInitials";
import { MoneyDisplay } from "@/components/MoneyDisplay/MoneyDisplay";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PdfService } from "@/services/pdf.service";
import { formatCPF, formatDate, getPaydayText } from "@/utils/format";
import { Button as ButtonAnt } from "antd";
import {
  AlertCircle,
  Archive,
  Briefcase,
  Calendar,
  CreditCard,
  Edit,
  User,
  Wallet,
  ArchiveX,
  Trash,
} from "lucide-react";
import { useEmployeeDetailScreenController } from "./useEmployeeDetailScreen.controller";
import { EmployeeStatus } from "@/enum/employee.enum";
import { isArchived } from "@/utils/employee";

const EmployeeDetailScreen = () => {
  const {
    employee,
    handleArchive,
    handleDelete,
    navigate,
    isLoading,
    archiveAlertMessage,
    archiveButtonLabel,
    archiveEmployee,
  } = useEmployeeDetailScreenController();

  if (!employee && isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
          <p className="text-lg font-medium">Funcionário não encontrado</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/")}
          >
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const InfoRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string | React.ReactNode;
  }) => (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="p-2 rounded-lg bg-secondary">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-8">
      <PageHeader title="Detalhes" subtitle={employee?.nome} showBack />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Header Card */}
        <Card className="p-6 glass-card border-border text-center">
          <AvatarInitials
            name={employee?.nome}
            photoUrl={employee?.foto_url}
            size="lg"
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold">{employee?.nome}</h2>
          <p className="text-muted-foreground">{employee?.cargo}</p>
          <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
            {employee?.tipo === "DIARISTA" ? "Diarista" : "Fixo (Quinzenas)"}
          </div>
        </Card>
        <Card
          style={{ display: "flex", gap: 8, flexDirection: "column" }}
          className="p-6 glass-card border-border text-center"
        >
          <ButtonAnt
            disabled={!employee.contrato?.assinaturas?.contratado}
            onClick={() => {
              PdfService.generateContract(employee, true);
            }}
            type="primary"
          >
            Ver contrato (Assinado digitalmente)
          </ButtonAnt>
          <ButtonAnt
            disabled={!employee.contrato}
            onClick={() => {
              PdfService.generateContract(employee);
            }}
            variant="outlined"
          >
            Ver contrato (Para assinar)
          </ButtonAnt>
        </Card>

        {/* Details Card */}
        <Card className="glass-card border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-secondary/50">
            <h3 className="font-semibold">Informações Pessoais</h3>
          </div>
          <div className="px-4">
            {employee?.cpf && (
              <InfoRow
                icon={User}
                label="CPF"
                value={formatCPF(employee?.cpf)}
              />
            )}
            {employee?.data_nascimento && (
              <InfoRow
                icon={Calendar}
                label="Data de Nascimento"
                value={formatDate(new Date(employee?.data_nascimento))}
              />
            )}
          </div>
        </Card>

        {/* Employment Card */}
        <Card className="glass-card border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-secondary/50">
            <h3 className="font-semibold">Dados Funcionais</h3>
          </div>
          <div className="px-4">
            <InfoRow icon={Briefcase} label="Cargo" value={employee?.cargo} />
            <InfoRow
              icon={Wallet}
              label={
                employee?.tipo === "DIARISTA" ? "Valor Diária" : "Salário Base"
              }
              value={<MoneyDisplay value={employee?.salario} size="md" />}
            />
            <InfoRow
              icon={Calendar}
              label="Data de Admissão"
              value={formatDate(new Date(employee?.data_admissao))}
            />
            <InfoRow
              icon={CreditCard}
              label="1° Dia do Pagamento"
              value={getPaydayText(employee?.primeiro_dia_pagamento)}
            />
            <InfoRow
              icon={CreditCard}
              label="2° Dia do Pagamento"
              value={getPaydayText(employee?.segundo_dia_pagamento)}
            />
            {employee.status === EmployeeStatus.ARCHIVED && (
              <InfoRow
                icon={ArchiveX}
                label="Data de arquivamento"
                value={formatDate(new Date(employee.arquivadoEm))}
              />
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1 h-12"
            onClick={() => navigate(`/employee/edit`, { state: employee })}
            disabled={isArchived(employee)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary" className="flex-1 h-12">
                <Archive className="w-4 h-4 mr-2" />
                {archiveButtonLabel()}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {archiveButtonLabel()} Funcionário
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja {archiveButtonLabel().toLowerCase()}{" "}
                  <strong>{employee?.nome}</strong>? {archiveAlertMessage()}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  disabled={archiveEmployee.isPending}
                  onClick={() =>
                    handleArchive(
                      employee.status === EmployeeStatus.ARCHIVED
                        ? "unarchive"
                        : "archive",
                    )
                  }
                  className="bg-success hover:bg-success/90"
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {isArchived(employee) && (
          <div className="flex gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1 h-8">
                  <Trash className="w-4 h-4 mr-2" />
                  Deletar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Deletar/demitir Funcionário
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja deletar/demitir{" "}
                    <strong>{employee?.nome}</strong>? Essa é uma ação
                    irreversível, todas as informações serão perdidas e NÃO
                    poderão ser recuperadas.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={archiveEmployee.isPending}
                    onClick={handleDelete}
                    className="bg-danger hover:bg-danger/90"
                  >
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetailScreen;
