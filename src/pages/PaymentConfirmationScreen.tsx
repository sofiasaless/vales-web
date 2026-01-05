import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '@/context/EmployeeContext';
import { PageHeader } from '@/components/PageHeader';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { VoucherItemCard } from '@/components/VoucherItemCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Payment } from '@/types';
import { CheckCircle, AlertCircle, Wallet, Receipt, Banknote } from 'lucide-react';

const PaymentConfirmationScreen = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const { getEmployee, calculatePayment, dispatch } = useEmployees();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const employee = getEmployee(employeeId || '');
  const paymentDetails = calculatePayment(employeeId || '');

  if (!employee || !paymentDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-danger mx-auto mb-4" />
          <p className="text-lg font-medium">Erro ao carregar pagamento</p>
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

  const handleConfirmPayment = async () => {
    setIsProcessing(true);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const payment: Payment = {
      id: `pay-${Date.now()}`,
      employeeId: employee.id,
      date: new Date(),
      baseSalary: paymentDetails.baseSalary,
      voucherTotal: paymentDetails.voucherTotal,
      amountPaid: paymentDetails.amountPaid,
      voucherItems: [...employee.currentVoucher],
    };

    dispatch({
      type: 'CONFIRM_PAYMENT',
      payload: { employeeId: employee.id, payment },
    });

    setIsProcessing(false);
    setShowConfirmModal(false);
    
    toast.success('Pagamento confirmado com sucesso!', {
      description: `Vale zerado para ${employee.name}`,
    });
    
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <PageHeader
        title="Confirmar Pagamento"
        subtitle={employee.name}
        showBack
      />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Salary Card */}
        <Card className="p-5 glass-card border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/20">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <span className="text-muted-foreground font-medium">Salário Base</span>
          </div>
          <MoneyDisplay
            value={paymentDetails.baseSalary}
            size="xl"
          />
        </Card>

        {/* Voucher Deduction Card */}
        <Card className="p-5 glass-card border-danger/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-danger/20">
              <Receipt className="w-5 h-5 text-danger" />
            </div>
            <span className="text-muted-foreground font-medium">Total do Vale a Descontar</span>
          </div>
          <MoneyDisplay
            value={-paymentDetails.voucherTotal}
            size="xl"
            variant="negative"
          />
          
          {/* Voucher items breakdown */}
          {employee.currentVoucher.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border space-y-2">
              {employee.currentVoucher.map((item) => (
                <VoucherItemCard
                  key={item.id}
                  item={item}
                  showControls={false}
                  className="bg-danger/5"
                />
              ))}
            </div>
          )}
        </Card>

        {/* Amount to Pay Card */}
        <Card className="p-6 bg-success/10 border-success/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-success/20">
              <Banknote className="w-5 h-5 text-success" />
            </div>
            <span className="text-success font-semibold text-lg">Total a Pagar</span>
          </div>
          <MoneyDisplay
            value={paymentDetails.amountPaid}
            size="xl"
            variant="positive"
            className="text-3xl"
          />
        </Card>

        {/* Confirm Button */}
        <Button
          className="w-full h-14 text-lg mt-6 bg-success hover:bg-success/90 text-success-foreground"
          onClick={() => setShowConfirmModal(true)}
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Confirmar Pagamento
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirmar Pagamento</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Você está prestes a confirmar o pagamento de{' '}
              <span className="font-semibold text-foreground">{employee.name}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Valor a ser pago:</p>
              <MoneyDisplay
                value={paymentDetails.amountPaid}
                size="xl"
                variant="positive"
                className="text-3xl"
              />
            </div>
            
            <div className="mt-4 p-3 bg-warning/10 border border-warning/30 rounded-lg">
              <p className="text-sm text-warning text-center">
                ⚠️ O vale será zerado após a confirmação
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              className="bg-success hover:bg-success/90 text-success-foreground"
              onClick={handleConfirmPayment}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentConfirmationScreen;
