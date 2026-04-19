import { useListEmployee } from "@/hooks/useEmployee";
import { useCurrentManager } from "@/hooks/useManager";
import { useListMonthlyFee } from "@/hooks/useMonthlyFee";
import { MensalidadeResponseBody } from "@/types/mensalidade";
import { calculateTotalVauchers } from "@/utils/calculate";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useEmployeeListScreenController() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const { data: employees, isLoading, isPending } = useListEmployee();
  const location = useLocation();

  const { data: currentManager, isLoading: loadingManager } =
    useCurrentManager();

  const totalVouchers = useMemo(() => {
    return employees?.reduce((acc, func) => {
      return acc + calculateTotalVauchers(func.vales);
    }, 0);
  }, [employees]);

  const employeesWithVoucher = useMemo(() => {
    return employees?.reduce((acc, func) => {
      if (func.vales.length > 0) {
        return acc + 1;
      }
      return acc + 0;
    }, 0);
  }, [employees]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredEmployees = useMemo(() => {
    return employees?.filter((func) =>
      func.nome.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [employees, searchQuery]);

  return {
    isModalOpen,
    handleCloseModal,
    currentManager,
    totalVouchers,
    employeesWithVoucher,
    loadingManager,
    isLoading,
    isPending,
    employees,
    searchQuery,
    setSearchQuery,
    filteredEmployees,
  };
}
