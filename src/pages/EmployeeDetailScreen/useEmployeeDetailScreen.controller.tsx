import { EmployeeStatus } from "@/enum/employee.enum";
import { useEmployee, useFindEmployee } from "@/hooks/useEmployee";
import { isArchived } from "@/utils/employee";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export function useEmployeeDetailScreenController() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: employee, isLoading } = useFindEmployee(id);

  const { archiveEmployee, deleteEmployee } = useEmployee();

  const handleArchive = async (action: 'archive' | 'unarchive') => {
    await archiveEmployee.mutateAsync({ employeeId: employee.id, action: action });
  };

  const handleDelete = async () => {
    await deleteEmployee.mutateAsync({ employeeId: employee.id });
  };

  const archiveButtonLabel = () => {
    return employee?.status === EmployeeStatus.ARCHIVED
      ? "Desarquivar"
      : "Arquivar";
  };

  const archiveAlertMessage = () => {
    return isArchived(employee)
      ? "Ao desarquivá-lo, você poderá editá-lo e adicionar novos vales."
      : "Ao arquivá-lo, você não poderá adicionar vales, editá-lo ou visualizá-lo na listagem de funcionários.";
  };

  useEffect(() => {
    if (archiveEmployee.isPending) return;
    if (archiveEmployee.isSuccess) {
      toast.success("Atualizado com sucesso!");
      navigate("/", { replace: true });
    }
    if (archiveEmployee.isError) {
      toast.error(
        `Erro ao tentar atualizar arquivamento do funcionário: ${archiveEmployee.error}`,
      );
    }
  }, [archiveEmployee.isPending]);

  useEffect(() => {
    if (deleteEmployee.isPending) return;
    if (deleteEmployee.isSuccess) {
      toast.success("Funcionário deletado com sucesso!");
      navigate("/", { replace: true });
    }
    if (deleteEmployee.isError) {
      toast.error(
        `Erro ao tentar demitir/deletar funcionário: ${deleteEmployee.error}`,
      );
    }
  }, [deleteEmployee.isPending]);

  return {
    employee,
    navigate,
    archiveEmployee,
    handleArchive,
    isLoading,
    archiveButtonLabel,
    archiveAlertMessage,
    handleDelete,
  };
}
