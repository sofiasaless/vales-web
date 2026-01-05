import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '@/context/EmployeeContext';
import { PageHeader } from '@/components/PageHeader';
import { AvatarInitials } from '@/components/AvatarInitials';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { formatDate, formatCPF, getPaydayText } from '@/utils/format';
import {
  User,
  Calendar,
  Wallet,
  Briefcase,
  CreditCard,
  Trash2,
  Edit,
  AlertCircle,
} from 'lucide-react';

const EmployeeDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEmployee, dispatch } = useEmployees();

  const employee = getEmployee(id || '');

  if (!employee) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
          <p className="text-lg font-medium">Funcionário não encontrado</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate('/')}
          >
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    dispatch({ type: 'DELETE_EMPLOYEE', payload: employee.id });
    toast.success('Funcionário excluído');
    navigate('/');
  };

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
      <PageHeader title="Detalhes" subtitle={employee.name} showBack />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Header Card */}
        <Card className="p-6 glass-card border-border text-center">
          <AvatarInitials name={employee.name} size="lg" className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold">{employee.name}</h2>
          <p className="text-muted-foreground">{employee.role}</p>
          <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
            {employee.type === 'DIARISTA' ? 'Diarista' : 'Fixo (Quinzenas)'}
          </div>
        </Card>

        {/* Details Card */}
        <Card className="glass-card border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-secondary/50">
            <h3 className="font-semibold">Informações Pessoais</h3>
          </div>
          <div className="px-4">
            {employee.cpf && (
              <InfoRow icon={User} label="CPF" value={formatCPF(employee.cpf)} />
            )}
            {employee.birthDate && (
              <InfoRow
                icon={Calendar}
                label="Data de Nascimento"
                value={formatDate(employee.birthDate)}
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
            <InfoRow icon={Briefcase} label="Cargo" value={employee.role} />
            <InfoRow
              icon={Wallet}
              label={employee.type === 'DIARISTA' ? 'Valor Diária' : 'Salário Base'}
              value={<MoneyDisplay value={employee.baseSalary} size="md" />}
            />
            <InfoRow
              icon={Calendar}
              label="Data de Admissão"
              value={formatDate(employee.admissionDate)}
            />
            <InfoRow
              icon={CreditCard}
              label="Dia do Pagamento"
              value={getPaydayText(employee.payday)}
            />
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1 h-12" disabled>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex-1 h-12">
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border">
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Funcionário</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir <strong>{employee.name}</strong>?
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-danger hover:bg-danger/90"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailScreen;
