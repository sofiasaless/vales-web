import { EmployeeStatus } from "@/enum/employee.enum";
import { useListEmployee } from "@/hooks/useEmployee";
import { useCurrentManager } from "@/hooks/useManager";
import { useMemo, useState } from "react";

export function useArchivedEmployeeListController() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const {
    data: employees,
    isLoading,
    isPending,
  } = useListEmployee(EmployeeStatus.ARCHIVED);

  const { data: currentManager, isLoading: loadingManager } =
    useCurrentManager();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredEmployees = useMemo(() => {
    return employees?.filter((func) =>
      func.nome.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [employees, searchQuery]);

  return {
    isModalOpen,
    handleCloseModal,
    loadingManager,
    isLoading,
    isPending,
    searchQuery,
    setSearchQuery,
    filteredEmployees,
  };
}
