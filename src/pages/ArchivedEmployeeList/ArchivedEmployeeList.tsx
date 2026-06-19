import { EmployeeCard } from "@/components/EmployeeCard/EmployeeCard";
import { Loading } from "@/components/Loading/Loading";
import { PageHeader } from "@/components/PageHeader/PageHeader";
import { Input, Spin } from "antd";
import { Search, Users } from "lucide-react";
import { useArchivedEmployeeListController } from "./controller";

const ArchivedEmployeeList = () => {
  const {
    loadingManager,
    isLoading,
    isPending,
    searchQuery,
    setSearchQuery,
    filteredEmployees,
  } = useArchivedEmployeeListController();

  if (loadingManager) return <Loading />;

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Funcionários arquivados" showBack/>

      <div className="px-4 py-4 max-w-lg mx-auto">
        <div className="max-w-lg mx-auto sticky top-0 z-10 bg-background">
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

export default ArchivedEmployeeList;
