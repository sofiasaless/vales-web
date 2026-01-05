import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '@/context/EmployeeContext';
import { PageHeader } from '@/components/PageHeader';
import { AvatarInitials } from '@/components/AvatarInitials';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { VoucherItemCard } from '@/components/VoucherItemCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  Plus, 
  CreditCard, 
  User, 
  History, 
  ShoppingBag,
  AlertCircle 
} from 'lucide-react';

const EmployeeManagementScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEmployee, getVoucherTotal, dispatch } = useEmployees();

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

  const voucherTotal = getVoucherTotal(employee.id);

  const handleRemoveItem = (itemId: string) => {
    dispatch({
      type: 'REMOVE_VOUCHER_ITEM',
      payload: { employeeId: employee.id, itemId },
    });
    toast.success('Item removido do vale');
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <PageHeader
        title={employee.name}
        subtitle={employee.role}
        showBack
      />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Employee Header */}
        <Card className="p-4 glass-card border-border">
          <div className="flex items-center gap-4">
            <AvatarInitials name={employee.name} size="lg" />
            <div className="flex-1">
              <h2 className="text-xl font-bold">{employee.name}</h2>
              <p className="text-muted-foreground">{employee.role}</p>
              <p className="text-sm text-muted-foreground">
                {employee.type === 'DIARISTA' ? 'Diarista' : 'Fixo (Quinzenas)'}
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
              onClick={() => navigate(`/menu/${employee.id}`)}
              className="bg-primary text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-1" />
              Itens
            </Button>
          </div>

          {employee.currentVoucher.length > 0 ? (
            <div className="space-y-2">
              {employee.currentVoucher.map((item) => (
                <VoucherItemCard
                  key={item.id}
                  item={item}
                  onRemove={() => handleRemoveItem(item.id)}
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
            onClick={() => navigate(`/payment/${employee.id}`)}
            disabled={employee.currentVoucher.length === 0 && voucherTotal === 0}
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Pagar Funcionário
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-12"
              onClick={() => navigate(`/employee/${employee.id}/details`)}
            >
              <User className="w-4 h-4 mr-2" />
              Ver Detalhes
            </Button>

            <Button
              variant="outline"
              className="h-12"
              onClick={() => navigate(`/employee/${employee.id}/history`)}
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
