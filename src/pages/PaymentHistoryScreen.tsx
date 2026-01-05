import { useParams, useNavigate } from 'react-router-dom';
import { useEmployees } from '@/context/EmployeeContext';
import { PageHeader } from '@/components/PageHeader';
import { MoneyDisplay } from '@/components/MoneyDisplay';
import { VoucherItemCard } from '@/components/VoucherItemCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDateTime } from '@/utils/format';
import { History, AlertCircle, Receipt, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const PaymentHistoryScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEmployee } = useEmployees();

  const employee = getEmployee(id || '');
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);

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

  const toggleExpand = (paymentId: string) => {
    setExpandedPayment((prev) => (prev === paymentId ? null : paymentId));
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <PageHeader
        title="Histórico de Pagamentos"
        subtitle={employee.name}
        showBack
      />

      <div className="px-4 py-4 max-w-lg mx-auto">
        {employee.paymentHistory.length > 0 ? (
          <div className="space-y-3">
            {employee.paymentHistory.map((payment) => {
              const isExpanded = expandedPayment === payment.id;

              return (
                <Card
                  key={payment.id}
                  className="glass-card border-border overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpand(payment.id)}
                    className="w-full p-4 text-left tap-highlight-none"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(payment.date)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <MoneyDisplay
                            value={payment.amountPaid}
                            size="lg"
                            variant="positive"
                          />
                          <span className="text-xs text-muted-foreground">
                            pago
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Vale descontado
                          </p>
                          <MoneyDisplay
                            value={-payment.voucherTotal}
                            size="sm"
                            variant="negative"
                          />
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-border pt-3 animate-slide-down">
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="p-2 bg-secondary/50 rounded-lg">
                          <p className="text-xs text-muted-foreground">
                            Salário Base
                          </p>
                          <MoneyDisplay value={payment.baseSalary} size="sm" />
                        </div>
                        <div className="p-2 bg-danger/10 rounded-lg">
                          <p className="text-xs text-muted-foreground">
                            Desconto Vale
                          </p>
                          <MoneyDisplay
                            value={-payment.voucherTotal}
                            size="sm"
                            variant="negative"
                          />
                        </div>
                      </div>

                      {payment.voucherItems.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Receipt className="w-4 h-4" />
                            Itens do Vale
                          </p>
                          <div className="space-y-2">
                            {payment.voucherItems.map((item) => (
                              <VoucherItemCard
                                key={item.id}
                                item={item}
                                showControls={false}
                                className="bg-secondary/30"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum pagamento registrado</p>
            <p className="text-sm text-muted-foreground">
              O histórico aparecerá aqui após o primeiro pagamento
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryScreen;
