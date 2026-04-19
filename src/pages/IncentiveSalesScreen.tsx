import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvatarInitials } from "@/components/AvatarInitials/AvatarInitials";
import { useIncentive } from "@/context/IncentiveContext";
import { Trophy, Minus, Plus, Crown, Target } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

const IncentiveSalesScreen = () => {
  const navigate = useNavigate();
  const {
    state: incentiveState,
    getActiveIncentive,
    getEmployeeCounter,
    incrementCounter,
    decrementCounter,
    setWinner,
  } = useIncentive();
  // const { state: employeeState } = useEmployees();

  const activeIncentive = getActiveIncentive();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const employees = [];

  // Check for winner when counters change
  useEffect(() => {
    if (!activeIncentive) return;

    for (const employee of employees) {
      const counter = getEmployeeCounter(employee.id);
      if (counter >= activeIncentive.meta && !activeIncentive.ganhador_id) {
        setWinner(employee.id, employee.name);
        toast.success(
          `🎉 ${employee.name} atingiu a meta e ganhou o incentivo!`,
        );
        break;
      }
    }
  }, [
    incentiveState.employeeCounters,
    activeIncentive,
    employees,
    setWinner,
    getEmployeeCounter,
  ]);

  const handleIncrement = (employeeId: string) => {
    if (activeIncentive?.ganhador_id) {
      toast.error("O incentivo já tem um ganhador");
      return;
    }
    incrementCounter(employeeId);
  };

  const handleDecrement = (employeeId: string) => {
    if (activeIncentive?.ganhador_id) {
      toast.error("O incentivo já tem um ganhador");
      return;
    }
    decrementCounter(employeeId);
  };

  if (!activeIncentive) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <PageHeader title="Registrar Vendas" subtitle="Incentivo" showBack />
        <div className="px-4 py-8 max-w-lg mx-auto text-center">
          <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">
            Nenhum incentivo ativo
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Crie um novo incentivo nas configurações
          </p>
          <Button
            className="mt-4"
            onClick={() => navigate("/settings/incentives")}
          >
            Ir para Incentivos
          </Button>
        </div>
      </div>
    );
  }

  const winner = activeIncentive.ganhador_id
    ? employees.find((e) => e.id === activeIncentive.ganhador_id)
    : null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader
        title="Registrar Vendas"
        subtitle={activeIncentive.descricao}
        showBack
      />

      <div className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Incentive Info */}
        <Card className="p-4 glass-card border-primary/30 bg-primary/5">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">Meta do Incentivo</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">
                {activeIncentive.meta} vendas para ganhar
              </span>
            </div>
            <span className="text-lg font-bold text-success">
              R$ {activeIncentive.valor_incentivo.toFixed(2)}
            </span>
          </div>
        </Card>

        {/* Winner Banner */}
        {winner && (
          <Card className="p-4 glass-card border-success/30 bg-success/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-success/20">
                <Crown className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-success font-semibold">Temos um ganhador!</p>
                <p className="text-foreground font-medium">{winner.name}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Employees List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Vendas por Funcionário
          </h2>

          {employees.map((employee) => {
            const counter = getEmployeeCounter(employee.id);
            const isWinner = activeIncentive.ganhador_id === employee.id;
            const progress = Math.min(
              (counter / activeIncentive.meta) * 100,
              100,
            );

            return (
              <Card
                key={employee.id}
                className={`p-4 glass-card border-border ${
                  isWinner ? "border-success/50 bg-success/5" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <AvatarInitials name={employee.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">
                        {employee.name}
                      </p>
                      {isWinner && (
                        <Crown className="w-4 h-4 text-success shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {employee.role}
                    </p>

                    {/* Progress bar */}
                    <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isWinner ? "bg-success" : "bg-primary"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {counter} / {activeIncentive.meta} vendas
                    </p>
                  </div>

                  {/* Counter Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => handleDecrement(employee.id)}
                      disabled={counter === 0 || !!activeIncentive.ganhador_id}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-bold text-lg text-foreground">
                      {counter}
                    </span>
                    <Button
                      variant="default"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => handleIncrement(employee.id)}
                      disabled={!!activeIncentive.ganhador_id}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IncentiveSalesScreen;
