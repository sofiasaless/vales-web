import { EmployeeCard } from "@/components/EmployeeCard/EmployeeCard";
import { Loading } from "@/components/Loading/Loading";
import { MoneyDisplay } from "@/components/MoneyDisplay/MoneyDisplay";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { Input, Spin } from "antd";
import { Search, TrendingUp, Users } from "lucide-react";
import { useEmployeeListScreenController } from "./controller";

const EmployeeListScreen = () => {
  const {
    loadingManager,
    currentManager,
    isLoading,
    employees,
    isPending,
    employeesWithVoucher,
    totalVouchers,
    searchQuery,
    setSearchQuery,
    filteredEmployees,
  } = useEmployeeListScreenController();

  if (loadingManager) return <Loading />;

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Funcionários" subtitle="Gerenciamento de Vales" />

      <div className="px-4 py-4 max-w-lg mx-auto">
        <div className="max-w-lg mx-auto sticky top-0 z-10 bg-background">
          <div
            style={{
              display: currentManager.tipo === "AUXILIAR" ? "none" : "",
            }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium">Total</span>
              </div>
              {isLoading || isPending ? (
                <Spin size="small" />
              ) : (
                <p className="text-2xl font-bold text-foreground">
                  {employees?.length}
                </p>
              )}
              <p className="text-xs text-muted-foreground">funcionários</p>
            </div>

            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 text-primary mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">Vales Abertos</span>
              </div>
              {isLoading || isPending ? (
                <Spin size="small" />
              ) : (
                <>
                  <MoneyDisplay
                    value={totalVouchers}
                    size="lg"
                    variant="positive"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {employeesWithVoucher} funcionário(s)
                  </p>
                </>
              )}
            </div>
          </div>
          <Input
            style={{ marginBlock: "10px" }}
            prefix={
              <Search
                style={{
                  width: 16,
                  height: 16,
                  color: "var(--text-secondary)",
                }}
              />
            }
            placeholder="Buscar funcionário..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            size="large"
          />
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-2 gap-3">
          {isLoading || isPending ? (
            <Spin />
          ) : (
            filteredEmployees?.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))
          )}
        </div>

        {filteredEmployees?.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhum funcionário cadastrado
            </p>
            <p className="text-sm text-muted-foreground">
              Toque em "Cadastrar" para adicionar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeListScreen;
