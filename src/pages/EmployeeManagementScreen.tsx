import { AvatarInitials } from '@/components/AvatarInitials';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { VoucherItemCard } from '@/components/VoucherItemCard';
import { useFindEmployee } from '@/hooks/useEmployee';
import { calculateTotalVauchers } from '@/utils/calculate';
import { Spin } from 'antd';
import {
  AlertCircle,
  CreditCard,
  History,
  Plus,
  ShoppingBag,
  User
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const EmployeeManagementScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: employee, isLoading } = useFindEmployee(id)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Spin />
        </div>
      </div>
    );
  }

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

  const voucherTotal = calculateTotalVauchers(employee?.vales);

  const handleRemoveItem = (itemId: string) => {

    toast.success('Item removido do vale');
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <PageHeader
        title={employee?.nome}
        subtitle={employee?.cargo}
        showBack
      />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Employee Header */}
        <Card className="p-4 glass-card border-border">
          <div className="flex items-center gap-4">
            <AvatarInitials name={employee?.nome} size="lg" />
            <div className="flex-1">
              <h2 className="text-xl font-bold">{employee?.nome}</h2>
              <p className="text-muted-foreground">{employee?.cargo}</p>
              <p className="text-sm text-muted-foreground">
                {employee?.tipo === 'DIARISTA' ? 'Diarista' : 'Fixo (Quinzenas)'}
              </p>
            </div>
          </div>
        </Card>

        {/* Current Voucher Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Vale Atual
            </h3>
            <Button
              size="sm"
              onClick={() => navigate(`/menu/${employee?.id}`)}
              className="bg-primary text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-1" />
              Itens
            </Button>
          </div>

          {employee?.vales.length > 0 ? (
            <div className="space-y-2">
              {employee?.vales.map((item) => (
                <VoucherItemCard
                  key={item.id}
                  item={item}
                  employeeId={employee.id}
                />
              ))}
            </div>
          ) : (
            <Card className="p-6 glass-card border-border text-center">
              <ShoppingBag className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Nenhum item no vale</p>
              <p className="text-sm text-muted-foreground">
                Toque em "+ Itens" para adicionar
              </p>
            </Card>
          )}

          {/* Voucher Total */}
          <Card className="p-4 mt-3 bg-secondary/50 border-border">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total do Vale</span>
              <MoneyDisplay
                value={voucherTotal}
                size="lg"
                variant={voucherTotal > 0 ? 'negative' : 'default'}
              />
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            className="w-full h-12 text-base bg-primary hover:bg-primary/90"
            onClick={() => navigate(`/payment/${employee?.id}`)}
            disabled={employee?.vales.length === 0 && voucherTotal === 0}
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Pagar Funcionário
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-12"
              onClick={() => navigate(`/employee/${employee?.id}/details`)}
            >
              <User className="w-4 h-4 mr-2" />
              Ver Detalhes
            </Button>

            <Button
              variant="outline"
              className="h-12"
              onClick={() => navigate(`/employee/${employee?.id}/history`)}
            >
              <History className="w-4 h-4 mr-2" />
              Histórico
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagementScreen;
